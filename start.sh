#!/bin/bash
# ==========================================================================
# Script de Inicialização - Laboratório de Quebra de Senhas e Criptoanálise
# ==========================================================================

# Cores para o output do terminal
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}==============================================================${NC}"
echo -e "${GREEN}      BEM-VINDO AO PASS-CRACK LAB - AMBIENTE DE QUEBRA       ${NC}"
echo -e "${BLUE}==============================================================${NC}"
echo ""

# 1. Verificar dependências básicas
echo -e "[*] Verificando dependências básicas..."
if ! command -v python3 &> /dev/null; then
    echo -e "${RED}[!] Erro: Python 3 não está instalado. Instale-o para prosseguir.${NC}"
    exit 1
fi
echo -e "${GREEN}[+] Python 3 detectado.${NC}"

# 2. Informar sobre ferramentas recomendadas para o laboratório
echo -e "[*] Dica de ferramentas recomendadas para o laboratório:"
echo -e "    - Hashcat (quebra acelerada por GPU/CPU)"
echo -e "    - John the Ripper (quebra robusta de arquivos e hashes)"
echo -e "    - Hashid / Hash-identifier (identificação de algoritmos)"
echo -e "    - Hydra (ataques de força bruta online/serviços)"
echo -e "    - Cewl (gerador de wordlists customizadas a partir de sites)"
echo -e "    - Crunch (gerador de dicionários baseado em padrões)"
echo ""

# 3. Validar se está rodando como Root (Sudo)
if [ "$EUID" -ne 0 ]; then
    echo -e "${YELLOW}[!] ALERTA: Você NÃO está rodando este script como root (sudo).${NC}"
    echo -e "${YELLOW}    Sem privilégios de root, ocorrerão as seguintes restrições:${NC}"
    echo -e "    - O dashboard web rodará na porta ${BLUE}8080${NC} em vez da porta padrão 80."
    echo -e "    - Os listeners FTP (9021) e SSH (9022) rodarão normalmente, mas a porta 80 ficará restrita."
    echo ""
    echo -e "    Para a experiência de laboratório COMPLETA, recomendamos rodar:"
    echo -e "    ${GREEN}sudo ./start.sh${NC}"
    echo ""
    read -p "Deseja continuar rodando em modo não-privilegiado (porta 8080)? [S/n]: " choice
    choice=${choice:-S}
    if [[ ! "$choice" =~ ^[Ss]$ ]]; then
        echo -e "[*] Inicialização abortada."
        exit 0
    fi
    PORT_IN_USE=8080
else
    echo -e "${GREEN}[+] Executando com privilégios de Root (Sudo).${NC}"
    
    # Verificar se o Apache2 está rodando e ocupando a porta 80
    if systemctl is-active --quiet apache2 &>/dev/null; then
        echo -e ""
        echo -e "${YELLOW}[!] O Apache2 está rodando e ocupando a porta 80.${NC}"
        echo -e "    Para acessar o laboratório na porta padrão 80, o Apache2 deve ser desligado."
        read -p "    Deseja parar o Apache2 temporariamente? [S/n]: " stop_apache
        stop_apache=${stop_apache:-S}
        if [[ "$stop_apache" =~ ^[Ss]$ ]]; then
            echo -e "[*] Parando serviço apache2..."
            systemctl stop apache2
            PORT_IN_USE=80
        else
            echo -e "${YELLOW}[*] Mantendo Apache2 rodando. O laboratório utilizará a porta alternativa 8080.${NC}"
            PORT_IN_USE=8080
        fi
    else
        PORT_IN_USE=80
    fi
fi

# 4. Iniciar o servidor
echo ""
echo -e "${GREEN}[+] Iniciando servidores locais...${NC}"
echo -e "[*] URL de acesso ao painel: ${BLUE}http://localhost:$PORT_IN_USE/${NC}"
echo -e "[*] Mock FTP Server escutando em: 127.0.0.1:9021"
echo -e "[*] Mock SSH Server escutando em: 127.0.0.1:9022"
echo -e "[*] TCP Hash Challenge escutando em: 127.0.0.1:9005"
echo -e "[*] Pressione ${RED}Ctrl+C${NC} a qualquer momento para finalizar o laboratório."
echo ""

# Executa o servidor Python passando a porta decidida via variável de ambiente
PORT_ENV=$PORT_IN_USE python3 server.py
