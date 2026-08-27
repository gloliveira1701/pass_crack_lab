#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
PASS-CRACK LAB: Laboratório de Quebra de Senhas e Criptoanálise.
Este script implementa:
1. Um servidor HTTP para o Dashboard e CTF (porta 80 ou 8080)
2. APIs de validação de desafios e logs de auditoria via Server-Sent Events (SSE)
3. Um listener TCP na porta 9022 simulando um console SSH brute-forcável
4. Um listener TCP na porta 9021 simulando um serviço FTP brute-forcável
5. Um listener TCP na porta 9005 que fornece um Hash MD5 para ser decifrado
6. Rota web brute-forcável `/api/login` para simular ataques L7
"""

import os
import sys
import json
import socket
import threading
import time
import hashlib
import unicodedata
from http.server import HTTPServer, BaseHTTPRequestHandler
from socketserver import ThreadingMixIn

# Configurações do Laboratório
PORT_WEB = int(os.environ.get('PORT_ENV', 80 if os.getuid() == 0 else 8080))
PORT_MOCK_FTP = 9021
PORT_MOCK_SSH = 9022
PORT_MOCK_HASH = 9005
RUNNING_AS_ROOT = (os.getuid() == 0)

# Estrutura de logs e locks
auth_logs = []
logs_lock = threading.Lock()
clients_sse = []
clients_lock = threading.Lock()

def add_auth_log(log_entry):
    """Adiciona um log no painel de auditoria e notifica clientes SSE"""
    with logs_lock:
        auth_logs.append(log_entry)
        if len(auth_logs) > 200:
            auth_logs.pop(0)
    
    # Notifica via SSE
    with clients_lock:
        for queue in clients_sse:
            queue.append(log_entry)

# --- MOCK FTP BRUTE-FORCE SERVER (PORT 9021) ---
def start_mock_ftp():
    server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    server.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    try:
        server.bind(('127.0.0.1', PORT_MOCK_FTP))
        server.listen(10)
        print(f"[+] Servidor FTP simulado ativo em 127.0.0.1:{PORT_MOCK_FTP}")
    except Exception as e:
        print(f"[!] Erro ao iniciar FTP simulado: {e}")
        return

    while True:
        try:
            conn, addr = server.accept()
            t = threading.Thread(target=handle_ftp_client, args=(conn, addr), daemon=True)
            t.start()
        except Exception:
            pass

def handle_ftp_client(conn, addr):
    try:
        conn.sendall(b"220 (vsFTPd 3.0.3) Ready for authentication...\r\n")
        conn.settimeout(5.0)
        
        user = ""
        logged_in = False
        
        rfile = conn.makefile('r', encoding='utf-8', errors='ignore')
        wfile = conn.makefile('w', encoding='utf-8', errors='ignore')
        
        for line in rfile:
            line = line.strip()
            if not line:
                continue
            
            parts = line.split(None, 1)
            cmd = parts[0].upper()
            arg = parts[1] if len(parts) > 1 else ""
            
            if cmd == "USER":
                user = arg
                wfile.write("331 Please specify the password.\r\n")
                wfile.flush()
            elif cmd == "PASS":
                password = arg
                # Credencial correta: ftp_admin / letmein
                if user == "ftp_admin" and password == "letmein":
                    wfile.write("230 Login successful. FLAG{FTP_CRACKED_SUCCESS}\r\n")
                    wfile.flush()
                    logged_in = True
                    add_auth_log({
                        "timestamp": time.strftime("%H:%M:%S"),
                        "service": "FTP (9021)",
                        "client_ip": addr[0],
                        "client_port": addr[1],
                        "username": user,
                        "password": password,
                        "status": "SUCESSO",
                        "details": "Brute-force bem sucedido! Flag exposta."
                    })
                else:
                    wfile.write("530 Login incorrect.\r\n")
                    wfile.flush()
                    add_auth_log({
                        "timestamp": time.strftime("%H:%M:%S"),
                        "service": "FTP (9021)",
                        "client_ip": addr[0],
                        "client_port": addr[1],
                        "username": user or "(não enviado)",
                        "password": password,
                        "status": "FALHA",
                        "details": f"Tentativa incorreta de login."
                    })
            elif cmd == "QUIT":
                wfile.write("221 Goodbye.\r\n")
                wfile.flush()
                break
            else:
                wfile.write("500 Syntax error, command unrecognized.\r\n")
                wfile.flush()
        
        rfile.close()
        wfile.close()
        conn.close()
    except Exception:
        try: conn.close() 
        except: pass

# --- MOCK SSH BRUTE-FORCE SERVER (PORT 9022) ---
def start_mock_ssh():
    server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    server.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    try:
        server.bind(('127.0.0.1', PORT_MOCK_SSH))
        server.listen(10)
        print(f"[+] Servidor SSH simulado ativo em 127.0.0.1:{PORT_MOCK_SSH}")
    except Exception as e:
        print(f"[!] Erro ao iniciar SSH simulado: {e}")
        return

    while True:
        try:
            conn, addr = server.accept()
            t = threading.Thread(target=handle_ssh_client, args=(conn, addr), daemon=True)
            t.start()
        except Exception:
            pass

def handle_ssh_client(conn, addr):
    try:
        conn.sendall(b"SSH-2.0-OpenSSH_8.4p1 Debian-5\r\n")
        time.sleep(0.1)
        conn.settimeout(8.0)
        
        # Simula prompt interativo para ferramentas ou logins manuais
        conn.sendall(b"login as: ")
        user = conn.recv(1024).decode('utf-8', errors='ignore').strip()
        
        conn.sendall(f"{user}@127.0.0.1's password: ".encode('utf-8'))
        password = conn.recv(1024).decode('utf-8', errors='ignore').strip()
        
        # Credencial correta: admin / qwerty
        if user == "admin" and password == "qwerty":
            welcome_msg = (
                "\r\n"
                "Linux lab-debian 5.10.0-8-amd64 #1 SMP Debian 5.10.46-4\r\n"
                "Last login: " + time.strftime("%a %b %d %H:%M:%S %Y") + " from 10.0.0.15\r\n\r\n"
                "Welcome to the password cracking environment.\r\n"
                "Here is your target flag: FLAG{SSH_CRACKED_SUCCESS}\r\n\r\n"
            )
            conn.sendall(welcome_msg.encode('utf-8'))
            add_auth_log({
                "timestamp": time.strftime("%H:%M:%S"),
                "service": "SSH (9022)",
                "client_ip": addr[0],
                "client_port": addr[1],
                "username": user,
                "password": password,
                "status": "SUCESSO",
                "details": "Acesso concedido! Flag revelada."
            })
        else:
            conn.sendall(b"\r\nAccess denied.\r\n")
            add_auth_log({
                "timestamp": time.strftime("%H:%M:%S"),
                "service": "SSH (9022)",
                "client_ip": addr[0],
                "client_port": addr[1],
                "username": user,
                "password": password,
                "status": "FALHA",
                "details": "Acesso negado para a credencial testada."
            })
        
        conn.close()
    except Exception:
        try: conn.close()
        except: pass

# --- MOCK TCP HASH LISTENER (PORT 9005) ---
def start_mock_hash():
    server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    server.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    try:
        server.bind(('127.0.0.1', PORT_MOCK_HASH))
        server.listen(10)
        print(f"[+] Desafio TCP Hash ativo em 127.0.0.1:{PORT_MOCK_HASH}")
    except Exception as e:
        print(f"[!] Erro ao iniciar TCP Hash listener: {e}")
        return

    while True:
        try:
            conn, addr = server.accept()
            t = threading.Thread(target=handle_hash_client, args=(conn, addr), daemon=True)
            t.start()
        except Exception:
            pass

def handle_hash_client(conn, addr):
    try:
        banner = (
            "====================================================\n"
            "   DESAFIO DE QUEBRA DE HASH LOCAL EM TEMPO REAL   \n"
            "====================================================\n"
            "Identifique e quebre o hash abaixo utilizando suas ferramentas.\n"
            "Hash MD5: 827ccb0eea8a706c4c34a16891f84e7b\n"
            "Digite o texto plano (plaintext) correspondente para resgatar a flag:\n"
            "> "
        )
        conn.sendall(banner.encode('utf-8'))
        conn.settimeout(10.0)
        
        response = conn.recv(1024).decode('utf-8', errors='ignore').strip()
        
        # O hash 827ccb0eea8a706c4c34a16891f84e7b é de "12345"
        if response == "12345":
            conn.sendall(b"\n[+] SUCESSO! A senha esta correta.\nFLAG{TCP_HASH_CRACKED_SUCCESS}\n")
            add_auth_log({
                "timestamp": time.strftime("%H:%M:%S"),
                "service": "HASH (9005)",
                "client_ip": addr[0],
                "client_port": addr[1],
                "username": "N/A",
                "password": response,
                "status": "SUCESSO",
                "details": "Decifrou o hash MD5 827ccb0eea8a706c4c34a16891f84e7b!"
            })
        else:
            conn.sendall(b"\n[!] FALHA! Senha incorreta.\nTente novamente.\n")
            add_auth_log({
                "timestamp": time.strftime("%H:%M:%S"),
                "service": "HASH (9005)",
                "client_ip": addr[0],
                "client_port": addr[1],
                "username": "N/A",
                "password": response,
                "status": "FALHA",
                "details": f"Enviou a senha incorreta '{response}' para o hash MD5."
            })
        
        conn.close()
    except Exception:
        try: conn.close()
        except: pass

# --- HTTP HANDLER ---
class ThreadedHTTPServer(ThreadingMixIn, HTTPServer):
    daemon_threads = True

class LabHTTPHandler(BaseHTTPRequestHandler):
    def log_message(self, format, *args):
        pass # Silenciar logs de console padrão

    def send_cors_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_cors_headers()
        self.end_headers()

    def do_GET(self):
        # 1. SSE Stream para Logs da Console de Auditoria
        if self.path == '/api/auth-logs':
            self.send_response(200)
            self.send_header('Content-Type', 'text/event-stream')
            self.send_header('Cache-Control', 'no-cache')
            self.send_header('Connection', 'keep-alive')
            self.send_cors_headers()
            self.end_headers()
            
            my_queue = []
            with clients_lock:
                clients_sse.append(my_queue)
                
            try:
                # Enviar histórico de logs
                with logs_lock:
                    for log in auth_logs:
                        self.wfile.write(f"data: {json.dumps(log)}\n\n".encode('utf-8'))
                    self.wfile.flush()
                
                while True:
                    if my_queue:
                        while my_queue:
                            log = my_queue.pop(0)
                            self.wfile.write(f"data: {json.dumps(log)}\n\n".encode('utf-8'))
                        self.wfile.flush()
                    time.sleep(0.1)
            except Exception:
                pass
            finally:
                with clients_lock:
                    if my_queue in clients_sse:
                        clients_sse.remove(my_queue)
            return

        # 2. API Status do Lab
        elif self.path == '/api/status':
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_cors_headers()
            self.end_headers()
            
            status = {
                "running_as_root": RUNNING_AS_ROOT,
                "port_web": PORT_WEB,
                "port_ftp": PORT_MOCK_FTP,
                "port_ssh": PORT_MOCK_SSH,
                "port_hash": PORT_MOCK_HASH
            }
            self.wfile.write(json.dumps(status).encode('utf-8'))
            return

        # Servir arquivos estáticos do dashboard
        else:
            filename = self.path.lstrip('/')
            if filename == '' or filename == 'index.html':
                filepath = 'index.html'
                content_type = 'text/html; charset=utf-8'
            elif filename == 'style.css':
                filepath = 'style.css'
                content_type = 'text/css; charset=utf-8'
            elif filename == 'app.js':
                filepath = 'app.js'
                content_type = 'application/javascript; charset=utf-8'
            else:
                self.send_response(404)
                self.send_header('Content-Type', 'text/html')
                self.end_headers()
                self.wfile.write(b"404 Not Found")
                return

            try:
                with open(filepath, 'rb') as f:
                    content = f.read()
                self.send_response(200)
                self.send_header('Content-Type', content_type)
                self.end_headers()
                self.wfile.write(content)
            except Exception as e:
                self.send_response(500)
                self.end_headers()
                self.wfile.write(f"Erro interno: {e}".encode('utf-8'))

    def do_POST(self):
        # 1. API Login Brute Force L7 `/api/login`
        if self.path == '/api/login':
            content_length = int(self.headers.get('Content-Length', 0))
            post_data = self.rfile.read(content_length)
            
            try:
                payload = json.loads(post_data.decode('utf-8'))
                user = payload.get('username', '').strip()
                password = payload.get('password', '').strip()
                
                success = False
                message = "Credenciais inválidas!"
                flag = ""
                
                # Credencial correta: web_operator / shadow
                if user == "web_operator" and password == "shadow":
                    success = True
                    message = "Autenticação bem sucedida!"
                    flag = "FLAG{WEB_BRUTEFORCE_SUCCESS}"
                    
                    add_auth_log({
                        "timestamp": time.strftime("%H:%M:%S"),
                        "service": f"HTTP (Porta {PORT_WEB})",
                        "client_ip": self.client_address[0],
                        "client_port": self.client_address[1],
                        "username": user,
                        "password": password,
                        "status": "SUCESSO",
                        "details": "Quebra de senha Web realizada! Flag liberada."
                    })
                else:
                    add_auth_log({
                        "timestamp": time.strftime("%H:%M:%S"),
                        "service": f"HTTP (Porta {PORT_WEB})",
                        "client_ip": self.client_address[0],
                        "client_port": self.client_address[1],
                        "username": user or "(não enviado)",
                        "password": password,
                        "status": "FALHA",
                        "details": "Tentativa de login Web malsucedida."
                    })
                
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.send_cors_headers()
                self.end_headers()
                self.wfile.write(json.dumps({"success": success, "message": message, "flag": flag}).encode('utf-8'))
            except Exception as e:
                self.send_response(400)
                self.end_headers()
                self.wfile.write(json.dumps({"error": str(e)}).encode('utf-8'))
            return

        # 2. Validador de Flags do CTF `/api/submit-flag`
        elif self.path == '/api/submit-flag':
            content_length = int(self.headers.get('Content-Length', 0))
            post_data = self.rfile.read(content_length)
            
            try:
                payload = json.loads(post_data.decode('utf-8'))
                challenge_id = int(payload.get('challenge_id', 0))
                flag_submitted = payload.get('flag', '').strip()
                
                success = False
                message = "Resposta incorreta. Analise o desafio e tente de novo!"
                
                # Dicionário de hashes SHA-256 das respostas corretas geradas pelo script python
                ans_dict = {
                    1: ['a0f27a31e68cc56a14583e6938e0d86c9ec8ddad9a21c17008494dd005ce92cc'],
                    2: ['22e0f87fb2733e26f71b1d0573d3dc30aba0ac56eb4b5214ea4e2524b4a6f45c'],
                    3: ['66c5d32348cf3a15496d2c3be819c07b97f028a5c1072fb76c45570c9d617526'],
                    4: ['a7cfac9addf7b09c1770bbe475cd31af9bfa4d840912e866a6acc8f39a398e08'],
                    5: ['642710e2ddb5779e02bf31c75fc2ad8a719075fede9ac7123ab97d1b6109fb2a'],
                    6: ['b3abe5d8c69b38733ad57ea75e83bcae42bbbbac75e3a5445862ed2f8a2cd677', 'bbd07c4fc02c99b97124febf42c7b63b5011c0df28d409fbb486b5a9d2e615ea'],
                    7: ['fb8fbeb56e1617252527440148dd5ab8eb944fa89c21a1cab9d0a53b2c3d583c'],
                    8: ['09457263311cae33ececad3bf6c004d42a41ff34faafd2ed3fd29e9c4a0c9fa2', '60ca645619f185fa5b1b13b4a5d640d13fe8216c0dc6e7c254b07279cc308386'],
                    9: ['31e7c1aaa68eeddf67de47a3da8675c7b0dc216a1f2affbc41ab41727e468900'],
                    10: ['22137a3f6cc4c2e12641b10be7a30996125bb9e921a63a87704d384cf25794d0'],
                    11: ['847e17bef343cc6a114f7110b1b7dad4b5f0a4fe56a156736e1cb8fbbc49c27d', '36370b553142c4fdee5d6a9f6ea3b6fb1392cde26d542946223218b4e8f039aa'],
                    12: ['cf24d2d60998508ffe1791e02f5c4d8684fbf9d115cdb93aa32a0fdb65831236'],
                    13: ['feca454f7d00f3b1684ede0051f0c8bca34251ae391b1ae5afb56e837491c153', 'c2b322652d08c1c29797f2a082130529ab0bad9ce01b780ebcf44f7e14b405e3'],
                    14: ['b3febd7845999add6081c10ab67bcf6289e1d2748c5e3100099c578a0c82f6ad', '8be0a73e4d1d7317ff4837da62dee0b92f0717da3fd1357e47bf8e4fc4faec46'],
                    15: ['d285691b324e0d9687e1b4ac621c475418020eb822f3130ab43cbcb8a11a677a'],
                    16: ['138938c78ddd2b346cf8910af9e8a7a3e7c094c02f736dea3fa56e232f62636d'],
                    17: ['eff52fd442ba9e186b6f556767d63b41a71416a6d517d66fde1ef945b89c86d6'],
                    18: ['b3eb40f342e3ba94c9c14b6c88d01b0d70fef0ce631e257d3c92ffaec554ebe5', 'd17899ae6eabd833761c5b79db9fa166ecb1d501094661339587a4c016f60fce'],
                    19: ['e060e815d62e92d245e63848c9772d9e66944d28d02c4ae7998be2d4f2543484', '316d9c971513d7fe9271ec213bbaf9554b2a61c8bc26114baee5a101487ae980'],
                    20: ['94ee059335e587e501cc4bf90613e0814f00a7b08bc7c648fd865a2af6a22cc2'],
                    21: ['5feceb66ffc86f38d952786c6d696c79c2dbc239dd4e91b46729d73a27fb57e9'],
                    22: ['55fdec963805de594b61b2c1692cadc2c1dfb844d6ac10c5bfed33c842087b2e'],
                    23: ['5feceb66ffc86f38d952786c6d696c79c2dbc239dd4e91b46729d73a27fb57e9'],
                    24: ['6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b'],
                    25: ['4e07408562bedb8b60ce05c1decfe3ad16b72230967de01f640b7e4729b49fce'],
                    26: ['545e5da241829466684eee9cbff490a6f4231296f801c554af060114aab8f0d8'],
                    27: ['d4c318996539a3e2d6bf456df46bb702da31a307a6aba03672fbaa6161e8a81f'],
                    28: ['48903c418242e758ab9dfe3024c60bd3fb8651585998579e37c15569b3698ab7', '738f05773cd28266112399fd21a2ab3bf1fc5e5ee588cb44f39d238419d71fbc'],
                    29: ['99b8828c194edaa700f94eb416b153df1aa99e6617a9584e7fca87b97dc6f89e'],
                    30: ['e3be6803d0ccd3993904e99d799fc46d558566af90dd3d0efa8f423853bd8ed5'],
                    31: ['5d2d6c34ffb7f7ea236548bb923a88c86b1a1d189f353658b745a29ff1866455'],
                    32: ['d9ad6a68537478115973fdb5a1276df3b039f5224223d52ce90fc1f3b76482fe', '70d4eb3fca6891bd7ec9fdd67623ec8d96ba7ad5ba844a3ecdd5abab17dee8fb'],
                    33: ['bf0896827bb6d9f7508f42b7024bb693c7b5e21daf10f8ac16a4eec5ed190236'],
                    34: ['44ec385acdb8a5d6c9a4405258061b63c0a073c0091e3dc1d7e90be3f07e2706'],
                    35: ['e05de5c290254653f9f5150dc88d0b3a8d5abaae5579d6a993abc485000dcc69', '2c3da5e73ea99e201db0c44e07e234bbde44003456b63f0fdfbca2d9a5de6849'],
                    36: ['11e7031d516ec2dec1689d9b837bcfc359a76808fac0dda37ebd295972f56e51'],
                    37: ['f6bf171b4a1555b3c89773a5b33ede90c171de1a6d7c2d2f63c7dccc03b52210'],
                    38: ['bd5dea8d46e0fdc5fcc958ae8aacf7250d86177dfda5b06fb62e5e3c59ce1fd7'],
                    39: ['76bb3d4da2e6c22c4d8cded008c49fd3a6b04ff3af7d1e33fc996534a1bec89a', '841d7bd41e52b4d634f1fcb81d8908643dc8812e90353f00e6713e5d4db8e909'],
                    40: ['aa02892fa1329eae4c63d95b8bc1e024f75021b11737703a95720cb49ed50638'],
                }

                if challenge_id in ans_dict:
                    def clean_str(s):
                        s_norm = unicodedata.normalize('NFKD', s)
                        return "".join([c for c in s_norm if not unicodedata.combining(c)]).upper().strip()

                    clean_submit = clean_str(flag_submitted)
                    submit_hash = hashlib.sha256(clean_submit.encode('utf-8')).hexdigest()

                    if submit_hash in ans_dict[challenge_id]:
                        success = True
                        message = f"Excelente! Resposta correta para o Desafio {challenge_id}!"
                    else:
                        success = False
                        message = "Flag ou resposta incorreta. Tente novamente!"

                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.send_cors_headers()
                self.end_headers()
                self.wfile.write(json.dumps({"success": success, "message": message}).encode('utf-8'))
                
            except Exception as e:
                self.send_response(400)
                self.end_headers()
                self.wfile.write(json.dumps({"error": str(e)}).encode('utf-8'))
            return

def start_web_server():
    global PORT_WEB
    try:
        server = ThreadedHTTPServer(('0.0.0.0', PORT_WEB), LabHTTPHandler)
        print(f"[+] Painel do Laboratorio ativo em http://127.0.0.1:{PORT_WEB}")
        server.serve_forever()
    except OSError as e:
        if e.errno == 98 and PORT_WEB == 80:
            print(f"[!] Erro: A porta 80 ja esta em uso.")
            print(f"[*] Tentando subir o laboratório na porta alternativa 8080...")
            PORT_WEB = 8080
            try:
                server = ThreadedHTTPServer(('0.0.0.0', PORT_WEB), LabHTTPHandler)
                print(f"[+] Painel do Laboratorio ativo em http://127.0.0.1:{PORT_WEB}")
                server.serve_forever()
            except Exception as ex:
                print(f"[!] Erro ao iniciar Servidor Web na porta {PORT_WEB}: {ex}")
                sys.exit(1)
        else:
            print(f"[!] Erro ao iniciar Servidor Web na porta {PORT_WEB}: {e}")
            sys.exit(1)

if __name__ == "__main__":
    print("="*60)
    print("      PASS-CRACK LAB: LAB DE QUEBRA DE SENHAS E HASHES      ")
    print("="*60)
    
    if not RUNNING_AS_ROOT:
        print("[!] AVISO: Executando sem permissao de root (sudo).")
        print("[!] O servidor web subira na porta 8080.")
        print("    Recomendado executar: sudo python3 server.py")
        print("-" * 60)

    # Iniciar Threads dos servidores de teste
    t_ftp = threading.Thread(target=start_mock_ftp, daemon=True)
    t_ftp.start()

    t_ssh = threading.Thread(target=start_mock_ssh, daemon=True)
    t_ssh.start()

    t_hash = threading.Thread(target=start_mock_hash, daemon=True)
    t_hash.start()

    # Iniciar Servidor Web principal na thread principal
    start_web_server()
