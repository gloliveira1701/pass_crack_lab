# 🔑 Pass-Crack Lab: Laboratório de Quebra de Senhas e Criptoanálise

Bem-vindo ao **Pass-Crack Lab**, um laboratório interativo desenvolvido no estilo *Cyber-Dashboard* para o ensino prático de criptoanálise, identificação de algoritmos de hash, quebra de senhas (offline) e auditoria de credenciais por dicionário/força bruta (online).

Este projeto é totalmente autocontido e foi desenvolvido para rodar localmente no seu **Kali Linux** (ou qualquer distribuição Debian-based).

---

## 🛠️ Tecnologias Utilizadas

1. **Backend (Python 3):** Servidor HTTP multithread (`server.py`) responsável por hospedar a aplicação web e validar as submissões de flags.
2. **Serviços Simulados (Mocking):**
   - **Porta 9021 (FTP):** Simula um serviço FTP vulnerável a ataques de força bruta online.
   - **Porta 9022 (SSH):** Simula um shell SSH vulnerável para testes de dicionário.
   - **Porta 9005 (TCP Hash):** Um listener TCP interativo que desafia o aluno a quebrar uma chave hash MD5 em tempo real.
   - **Endpoint `/api/login`:** Simulação L7 de formulário web brute-forcável.
3. **Console de Auditoria (SSE):** Monitoramento das tentativas de login com exposição de IP, Usuário e Senha testados em tempo real na interface web através de Server-Sent Events (SSE).
4. **Frontend (HTML5/CSS3/JS):** Layout cibernético premium (*dark mode*, *glassmorphism*), placar de pontuação, medidores de progresso salvos localmente e utilitários embutidos de identificação de hash e codificadores de base.

---

## 📂 Estrutura do Projeto

```text
pass_crack_lab/
├── README.md         # Documentação de introdução e instrução
├── start.sh          # Script bash automatizado para inicialização
├── server.py         # Servidor Python 3 e Serviços de escuta de rede (FTP, SSH, TCP)
├── index.html        # Página principal do dashboard visual
├── style.css         # Estilização cibernética e responsiva
├── app.js            # Lógica cliente, dataset de 40 desafios e utilitários JS

```

---

## 🚀 Como Iniciar o Laboratório

Para que os serviços simulados de FTP, SSH e o servidor HTTP funcionem na porta padrão (80), é altamente recomendado iniciar o script com privilégios de administrador (**sudo**):

```bash
# 1. Entre no diretório do projeto
cd pass_crack_lab

# 2. Garanta que o script de start seja executável (já configurado)
chmod +x start.sh

# 3. Execute o script de inicialização
sudo ./start.sh
```

> **Nota:** Se você optar por rodar sem privilégios de root (`./start.sh`), o servidor web subirá na porta alternativa **8080**.

---

## 📂 Guia Prático de Wordlists no Kali Linux

### 1. Localização Padrão
No Kali Linux, todos os dicionários padrão do sistema são instalados sob o diretório:
```text
/usr/share/wordlists
```

### 2. Descompactando a RockYou
A wordlist mais popular para auditorias de senha (`rockyou.txt`) vem compactada por padrão para economizar espaço de armazenamento. Para usá-la, você precisa extraí-la:
```bash
sudo gzip -d /usr/share/wordlists/rockyou.txt.gz
# ou usando gunzip
sudo gunzip /usr/share/wordlists/rockyou.txt.gz
```

### 3. Instalando o SecLists
O **SecLists** é a coleção definitiva de listas de teste de segurança no Kali. Instale-a via terminal:
```bash
sudo apt update && sudo apt install -y seclists
# Os arquivos ficarão acessíveis em:
ls /usr/share/seclists/
```

---

## ⚡ Comandos de Exemplo das Ferramentas

### 1. Hashid (Identificador de Algoritmo)
Para identificar o algoritmo provável de uma string hash desconhecida:
```bash
hashid 827ccb0eea8a706c4c34a16891f84e7b
```

### 2. John the Ripper
*   **Quebrar hashes normais (MD5 cru):**
    ```bash
    john --format=raw-md5 hashes.txt --wordlist=/usr/share/wordlists/rockyou.txt
    ```
*   **Quebrar arquivos ZIP protegidos:**
    ```bash
    zip2john backup.zip > zip.hash
    john --wordlist=/usr/share/wordlists/rockyou.txt zip.hash
    ```
*   **Quebrar arquivos PDF protegidos:**
    ```bash
    pdf2john documento.pdf > pdf.hash
    john --wordlist=/usr/share/wordlists/rockyou.txt pdf.hash
    ```

### 3. Hashcat (Aceleração por GPU/CPU)
*   **Ataque direto por dicionário (-a 0) para hash SHA-256 (-m 1400):**
    ```bash
    hashcat -a 0 -m 1400 hash.txt /usr/share/wordlists/rockyou.txt --force
    ```
    *(A flag `--force` é recomendada para ignorar avisos OpenCL se estiver rodando em Máquina Virtual sem GPU dedicada).*
*   **Ataque por máscara (-a 3) para MD5 (-m 0):**
    ```bash
    # Quebra senhas de exatamente 4 minúsculas e 2 números (ex: abcd12)
    hashcat -a 3 -m 0 hash.txt ?l?l?l?l?d?d
    ```

### 4. Hydra (Ataques Online de Serviços Locais)
*   **Força bruta contra o serviço SSH local simulado na porta 9022:**
    ```bash
    hydra -l admin -P /usr/share/wordlists/rockyou.txt ssh://127.0.0.1:9022 -t 4
    ```

---

## 🔗 Links e Repositórios Úteis

-   **SecLists (GitHub Oficial):** [https://github.com/danielmiessler/SecLists](https://github.com/danielmiessler/SecLists)
-   **Weakpass (Dicionários Gigantes):** [https://weakpass.com](https://weakpass.com)
-   **Hashcat (Site Oficial):** [https://hashcat.net](https://hashcat.net)
-   **Openwall John the Ripper:** [https://www.openwall.com/john/](https://www.openwall.com/john/)
-   **Packet Storm Wordlists:** [https://packetstormsecurity.com/Crackers/wordlists/](https://packetstormsecurity.com/Crackers/wordlists/)

---
*Bons estudos no desenvolvimento de técnicas de criptoanálise!*
