/* ==========================================================================
   PASS-CRACK LAB: LÓGICA FRONTEND JAVASCRIPT
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // --- DATASET DOS 40 DESAFIOS CTF ---
    const ALL_CHALLENGES = [
        // CATEGORY: ENCODINGS (1 - 10)
        {
            "id": 1,
            "title": "Decodificando Texto I",
            "difficulty": "fácil",
            "points": 50,
            "desc": "Decodifique a string <code>RkxBR3tCQTZTRTY0X0RFQ09ERUR9</code> para revelar a flag secreta.",
            "cmd": "echo 'RkxBR3tCQTZTRTY0X0RFQ09ERUR9' | base64 -d",
            "help": "Este formato converte dados binários em um conjunto de caracteres legíveis ASCII. Ela sempre usa 64 caracteres legíveis com preenchimento opcional '=' no final.",
            "hint": "Use a ferramenta de decodificação na aba Decoders com a opção correspondente.",
            "category": "encodings"
        },
        {
            "id": 2,
            "title": "Decodificando Texto II",
            "difficulty": "fácil",
            "points": 50,
            "desc": "Decodifique a seguinte string codificada: <code>JZEWY3TREBDG623FOQQG6ZRA</code>.",
            "cmd": "echo 'JZEWY3TREBDG623FOQQG6ZRA' | base32 -d",
            "help": "Este formato usa um alfabeto de 32 caracteres (letras maiúsculas e alguns dígitos) para codificação. É comumente usada em chaves OTP (Google Authenticator) e sistemas sem distinção de maiúsculas.",
            "hint": "Use a ferramenta de decodificação na aba Decoders com a opção correspondente.",
            "category": "encodings"
        },
        {
            "id": 3,
            "title": "Decodificando Texto III",
            "difficulty": "fácil",
            "points": 50,
            "desc": "Converta a sequência <code>464c41477b4845585f544f5f41534349497d</code> para caracteres ASCII para recuperar a flag.",
            "cmd": "echo -n '464c41477b4845585f544f5f41534349497d' | xxd -r -p",
            "help": "Esta representação representa cada byte de informação como dois caracteres hexadecimais de 0-9 e a-f (ou A-F).",
            "hint": "Você pode usar um conversor de base apropriado na aba Decoders.",
            "category": "encodings"
        },
        {
            "id": 4,
            "title": "Decodificando Texto IV",
            "difficulty": "fácil",
            "points": 50,
            "desc": "Converta o código a seguir em texto ASCII plano: <br><code>01000110 01001100 01000001 01000111 01111011 01000010 01001001 01001110 01000001 01010010 01011001 01111101</code>",
            "cmd": "Consulte nosso conversor na aba Decoders",
            "help": "Cada grupo de 8 bits (1s e 0s) representa um caractere na tabela ASCII.",
            "hint": "Cole sem espaços na aba Decoders usando o tradutor apropriado.",
            "category": "encodings"
        },
        {
            "id": 5,
            "title": "Identificando Algoritmo de Hash I",
            "difficulty": "fácil",
            "points": 50,
            "desc": "Utilize o utilitário <code>hashid</code> para analisar o hash <code>5d41402abc4b2a76b9719d911017c592</code>. Qual é a sigla de 3 letras associada a esse algoritmo clássico?",
            "cmd": "hashid 5d41402abc4b2a76b9719d911017c592",
            "help": "Este algoritmo de hash tem 128 bits e é exibido sempre como uma sequência hexadecimal de 32 caracteres.",
            "hint": "Escreva a sigla em maiúsculas.",
            "category": "encodings"
        },
        {
            "id": 6,
            "title": "Identificando Algoritmo de Hash II",
            "difficulty": "fácil",
            "points": 50,
            "desc": "Identifique a classe do hash <code>fcde5f8210a246fa78e04f33d0f468a3678350988ff153fa9a255ddb171dc9e5</code>. Responda com a sigla do algoritmo.",
            "cmd": "hashid fcde5f8210a246fa78e04f33d0f468a3678350988ff153fa9a255ddb171dc9e5",
            "help": "Este tipo de hash possui 256 bits e é representado por 64 caracteres hexadecimais.",
            "hint": "Responda com a sigla correspondente.",
            "category": "encodings"
        },
        {
            "id": 7,
            "title": "Cifra de Substituição Cíclica",
            "difficulty": "fácil",
            "points": 50,
            "desc": "Esta cifra rotaciona as letras do alfabeto em algumas posições fixas. Decifre: <code>SYNT{EBG13_RAPELCGVBA}</code>.",
            "cmd": "echo 'SYNT{EBG13_RAPELCGVBA}' | tr 'A-Za-z' 'N-ZA-Mn-za-m'",
            "help": "Por rotacionar exatamente a metade das 26 letras do alfabeto, a mesma função codifica e decodifica.",
            "hint": "Use a aba Decoders ou comandos de substituição de caracteres no Linux.",
            "category": "encodings"
        },
        {
            "id": 8,
            "title": "Ferramenta CLI do Kali de Recon",
            "difficulty": "fácil",
            "points": 50,
            "desc": "Qual é o nome principal da ferramenta nativa do Kali Linux que identifica formatos de hashes criptográficos na linha de comando?",
            "cmd": "hashid --help",
            "help": "Ela suporta a identificação de centenas de tipos de hashes baseando-se em assinaturas e regex.",
            "hint": "Geralmente é instalada com apt install hashid.",
            "category": "encodings"
        },
        {
            "id": 9,
            "title": "Assinatura de Algoritmo de Hash I",
            "difficulty": "médio",
            "points": 100,
            "desc": "Hashes gerados para senhas Unix/Web que começam com os identificadores <code>$2a$</code> ou <code>$2y$</code> são conhecidos como quais hashes?",
            "cmd": "hashid '$2a$12$R9h/cIPz0gi.UR3RYyXW...' ",
            "help": "Esse algoritmo lento usa fator de custo (Salt) e é muito resistente a ataques de dicionário por hardware.",
            "hint": "Responda com o nome do algoritmo em minúsculo ou maiúsculo.",
            "category": "encodings"
        },
        {
            "id": 10,
            "title": "Assinatura de Algoritmo de Hash II",
            "difficulty": "médio",
            "points": 100,
            "desc": "Qual algoritmo moderno e vencedor do PHC (Password Hashing Competition) gera hashes iniciados por <code>$argon2i$</code> ou <code>$argon2id$</code>?",
            "cmd": "",
            "help": "O Argon2 é altamente parametrizável, controlando custo de memória, processamento e paralelismo.",
            "hint": "Digite a resposta em letras maiúsculas.",
            "category": "encodings"
        },

        // CATEGORY: JOHN THE RIPPER (11 - 20)
        {
            "id": 11,
            "title": "John: Modo Single User",
            "difficulty": "fácil",
            "points": 50,
            "desc": "Qual parâmetro/flag do John ativa o modo 'Single User', que deriva palpites baseados no nome do usuário do sistema?",
            "cmd": "john --help",
            "help": "Esse modo gera mutações rápidas usando dados da conta do próprio usuário do Linux, ideal como primeiro passo.",
            "hint": "A flag é -single ou --single.",
            "category": "john"
        },
        {
            "id": 12,
            "title": "Mesclando Senhas Unix: Unshadow",
            "difficulty": "fácil",
            "points": 50,
            "desc": "Qual é o nome da ferramenta utilitária que vem com o John usada para mesclar os arquivos <code>/etc/passwd</code> e <code>/etc/shadow</code> para quebra?",
            "cmd": "man unshadow",
            "help": "O passwd contém usuários e o shadow contém os hashes. O John precisa deles combinados.",
            "hint": "O comando começa com 'un' seguido de 'shadow'. Responda 'unshadow'.",
            "category": "john"
        },
        {
            "id": 13,
            "title": "John: Declarando o Formato do Hash",
            "difficulty": "fácil",
            "points": 50,
            "desc": "Qual parâmetro/flag do John é usada para declarar explicitamente qual é o algoritmo do hash (ex: raw-md5, descrypt)?",
            "cmd": "john --list=formats",
            "help": "Declarar o formato evita que o John gaste tempo tentando detectar algoritmos de forma heurística.",
            "hint": "A flag é --format=NOME.",
            "category": "john"
        },
        {
            "id": 14,
            "title": "John: Passando Wordlist",
            "difficulty": "fácil",
            "points": 50,
            "desc": "Qual flag do John the Ripper é utilizada para indicar um arquivo de dicionário (wordlist) externo para quebra?",
            "cmd": "john --help",
            "help": "A flag aponta para o caminho absoluto ou relativo do dicionário a ser utilizado.",
            "hint": "Sintaxe: --wordlist=caminho.txt.",
            "category": "john"
        },
        {
            "id": 15,
            "title": "Quebrando Arquivos ZIP",
            "difficulty": "médio",
            "points": 100,
            "desc": "Qual utilitário complementar do John converte arquivos ZIP criptografados em um formato de hash que o John consegue entender?",
            "cmd": "zip2john backup.zip > zip.hash",
            "help": "Ferramentas do tipo *2john preparam arquivos binários complexos para que os hashes possam ser extraídos e quebrados.",
            "hint": "Une as palavras zip, o número 2 e john.",
            "category": "john"
        },
        {
            "id": 16,
            "title": "Quebrando Arquivos PDF",
            "difficulty": "médio",
            "points": 100,
            "desc": "Qual utilitário do John converte arquivos PDF protegidos por senha para formato de hash?",
            "cmd": "pdf2john documento.pdf > pdf.hash",
            "help": "Ele analisa a criptografia de donos ou usuários contidas nos metadados do PDF.",
            "hint": "Sintaxe é pdf2john.",
            "category": "john"
        },
        {
            "id": 17,
            "title": "Quebrando Arquivos RAR",
            "difficulty": "médio",
            "points": 100,
            "desc": "Qual é a ferramenta utilitária que extrai a assinatura/hash criptográfico de arquivos compactados RAR?",
            "cmd": "rar2john arquivo.rar > rar.hash",
            "help": "Arquivos RAR usam algoritmos de derivação pesados, mas podem ser quebrados offline se a senha for fraca.",
            "hint": "Responda rar2john.",
            "category": "john"
        },
        {
            "id": 18,
            "title": "John: Ativando Regras de Mutação",
            "difficulty": "médio",
            "points": 100,
            "desc": "Qual parâmetro ativa as regras padrão de mangling definidas no <code>john.conf</code> para transformar as palavras da wordlist (ex: capitalizar, duplicar)?",
            "cmd": "john --rules --wordlist=lista.txt hash.txt",
            "help": "Regras modificam palavras comuns (ex: 'admin' vira 'Admin' ou 'admin123') estendendo o alcance do dicionário.",
            "hint": "A flag é --rules ou -rules.",
            "category": "john"
        },
        {
            "id": 19,
            "title": "Arquivo de Configuração do John",
            "difficulty": "difícil",
            "points": 150,
            "desc": "Qual o caminho absoluto padrão onde fica armazenado o arquivo de configuração de regras e formatos (<code>john.conf</code>) no Kali Linux?",
            "cmd": "find /etc -name john.conf",
            "help": "Este arquivo contém todas as regras padrão aplicadas ao usar --rules.",
            "hint": "Fica localizado em /etc/john/john.conf ou /etc/john.conf.",
            "category": "john"
        },
        {
            "id": 20,
            "title": "Cracking MD5 Offline com John",
            "difficulty": "difícil",
            "points": 150,
            "desc": "Salve o hash <code>098f6bcd4621d373cade4e832627b4f6</code> em um arquivo txt e quebre-o usando o John the Ripper. Qual é a senha original decifrada?",
            "cmd": "echo '098f6bcd4621d373cade4e832627b4f6' > hash.txt && john --format=raw-md5 hash.txt",
            "help": "Dica: o John exibirá o resultado no terminal ou você pode usar 'john --show hash.txt'.",
            "hint": "A senha é uma palavra em inglês muito usada para experimentações e desenvolvimento (4 letras). Responda 'test'.",
            "category": "john"
        },

        // CATEGORY: HASHCAT (21 - 30)
        {
            "id": 21,
            "title": "Hashcat: Modo MD5",
            "difficulty": "fácil",
            "points": 50,
            "desc": "No Hashcat, qual número identifica o modo de hash (parâmetro <code>-m</code>) para o algoritmo MD5?",
            "cmd": "hashcat --help | grep -i MD5",
            "help": "O modo define o parser do algoritmo criptográfico correto a ser carregado pelo kernel OpenCL/CUDA.",
            "hint": "É o menor número inteiro absoluto possível: 0.",
            "category": "hashcat"
        },
        {
            "id": 22,
            "title": "Hashcat: Modo SHA-256",
            "difficulty": "fácil",
            "points": 50,
            "desc": "Qual número identifica o modo de hash (parâmetro <code>-m</code>) para o algoritmo SHA-256 no Hashcat?",
            "cmd": "hashcat --help | grep -i SHA256",
            "help": "Algoritmos SHA-2 usam modos separados dependendo do tamanho da saída de bits.",
            "hint": "É o número mil e quatrocentos: 1400.",
            "category": "hashcat"
        },
        {
            "id": 23,
            "title": "Hashcat Attack Mode: Straight",
            "difficulty": "fácil",
            "points": 50,
            "desc": "Qual código numérico (parâmetro <code>-a</code>) ativa o modo de ataque direto (Straight), que utiliza uma wordlist linear?",
            "cmd": "hashcat --help",
            "help": "Esse modo testa cada linha do dicionário fornecido diretamente contra os hashes.",
            "hint": "É o número 0.",
            "category": "hashcat"
        },
        {
            "id": 24,
            "title": "Hashcat Attack Mode: Combinator",
            "difficulty": "médio",
            "points": 100,
            "desc": "Qual código numérico (parâmetro <code>-a</code>) ativa o modo Combinador, que concatena palavras de dois dicionários separados?",
            "cmd": "hashcat --help",
            "help": "Permite testar combinações como 'nome+sobrenome' ou 'senha+ano' dinamicamente em alta velocidade.",
            "hint": "É o número 1.",
            "category": "hashcat"
        },
        {
            "id": 25,
            "title": "Hashcat Attack Mode: Brute Force / Mask",
            "difficulty": "médio",
            "points": 100,
            "desc": "Qual código numérico (parâmetro <code>-a</code>) ativa o ataque por máscara (Mask Attack) no Hashcat?",
            "cmd": "hashcat --help",
            "help": "Máscaras definem estruturas fixas para otimizar o brute-force (ex: apenas letras maiúsculas seguidas de números).",
            "hint": "É o número 3.",
            "category": "hashcat"
        },
        {
            "id": 26,
            "title": "Sintaxe de Máscara do Hashcat",
            "difficulty": "médio",
            "points": 100,
            "desc": "No ataque por máscara do Hashcat, qual a sintaxe de máscara para representar uma senha de exatamente 4 letras minúsculas seguidas por 2 dígitos numéricos (ex: qwme10)?",
            "cmd": "",
            "help": "Curingas da máscara: ?l representa letra minúscula, ?d representa dígito decimal, ?u maiúscula.",
            "hint": "Escreva a máscara completa incluindo as interrogações: ?l?l?l?l?d?d.",
            "category": "hashcat"
        },
        {
            "id": 27,
            "title": "Cracking SHA-1 Offline com Hashcat",
            "difficulty": "difícil",
            "points": 150,
            "desc": "Quebre o hash SHA-1 <code>5ba3078a9c22428157092ab7900d7d41d2965fd2</code> usando o Hashcat. Qual é a senha original?",
            "cmd": "echo '5ba3078a9c22428157092ab7900d7d41d2965fd2' > sha1.txt && hashcat -a 0 -m 100 sha1.txt /usr/share/wordlists/rockyou.txt",
            "help": "Dica: Garanta que você especificou o modo 100 (SHA-1) no Hashcat.",
            "hint": "É o nome de uma famosa marca esportiva ou um nome próprio americano muito associado ao basquete (6 letras): jordan.",
            "category": "hashcat"
        },
        {
            "id": 28,
            "title": "Hashcat Help Flag",
            "difficulty": "fácil",
            "points": 50,
            "desc": "Qual parâmetro completo é usado para listar a ajuda e obter a tabela de modos de hash do Hashcat?",
            "cmd": "hashcat --help",
            "help": "Fornece a documentação do aplicativo com modos de dispositivos e códigos de erro.",
            "hint": "Responda com --help ou -h.",
            "category": "hashcat"
        },
        {
            "id": 29,
            "title": "Contornando Falta de GPU (CPU Force)",
            "difficulty": "médio",
            "points": 100,
            "desc": "Qual flag do Hashcat força a execução do processamento de quebra usando a CPU (ignorando os alertas de drivers OpenCL ausentes ou incompatíveis)?",
            "cmd": "hashcat --force ...",
            "help": "Útil quando rodamos o Kali Linux dentro de máquinas virtuais (VMs) sem placa de vídeo física exposta.",
            "hint": "O parâmetro de linha de comando é --force.",
            "category": "hashcat"
        },
        {
            "id": 30,
            "title": "Hashcat: Modo NetNTLMv2",
            "difficulty": "difícil",
            "points": 150,
            "desc": "Qual número identifica o modo de hash (<code>-m</code>) para quebrar hashes capturados NetNTLMv2 do protocolo de autenticação de rede do Windows?",
            "cmd": "hashcat --help | grep -i NetNTLMv2",
            "help": "Esse hash é extraído via ataques de envenenamento de LLMNR/NBT-NS (Responder) em redes corporativas.",
            "hint": "É o número 5600.",
            "category": "hashcat"
        },

        // CATEGORY: WORDLISTS & RECON (31 - 40)
        {
            "id": 31,
            "title": "Localização das Wordlists no Kali",
            "difficulty": "fácil",
            "points": 50,
            "desc": "Qual é o caminho absoluto padrão do diretório que centraliza as principais wordlists pré-instaladas no Kali Linux?",
            "cmd": "ls /usr/share/wordlists",
            "help": "Nessa pasta ficam os arquivos do rockyou, dirb, dirbuster, fern-wifi, etc.",
            "hint": "Responda /usr/share/wordlists.",
            "category": "wordlists"
        },
        {
            "id": 32,
            "title": "Descompactando a RockYou",
            "difficulty": "fácil",
            "points": 50,
            "desc": "Qual é o comando do Linux completo para extrair/descompactar a wordlist rockyou.txt que vem compactada por padrão no Kali?",
            "cmd": "ls /usr/share/wordlists/rockyou*",
            "help": "O arquivo original vem compactado como .gz para economizar espaço em disco na distribuição.",
            "hint": "Você pode usar gzip -d /usr/share/wordlists/rockyou.txt.gz ou gunzip /usr/share/wordlists/rockyou.txt.gz.",
            "category": "wordlists"
        },
        {
            "id": 33,
            "title": "A Wordlist Definitiva",
            "difficulty": "fácil",
            "points": 50,
            "desc": "Qual é o nome exato do arquivo de texto (com extensão) do dicionário mais famoso e utilizado mundialmente que vem compactado no Kali?",
            "cmd": "",
            "help": "Esta wordlist foi construída a partir de um vazamento real de um site de jogos chamado RockYou em 2009.",
            "hint": "Responda rockyou.txt.",
            "category": "wordlists"
        },
        {
            "id": 34,
            "title": "Localização do SecLists",
            "difficulty": "médio",
            "points": 100,
            "desc": "Se você instalar o pacote <code>seclists</code> via apt no Kali Linux, qual será a pasta absoluta onde os arquivos serão instalados?",
            "cmd": "sudo apt install seclists && ls /usr/share/seclists",
            "help": "O SecLists organiza dicionários em pastas como Discovery, Fuzzing, Passwords, Usernames e Web-Shells.",
            "hint": "Caminho padrão: /usr/share/seclists.",
            "category": "wordlists"
        },
        {
            "id": 35,
            "title": "Criador do Repositório SecLists",
            "difficulty": "médio",
            "points": 100,
            "desc": "Qual é o nome de usuário do criador e mantenedor principal do repositório SecLists no GitHub?",
            "cmd": "Veja o link do SecLists na aba Fundamentação",
            "help": "Dica: Começa com daniel e o sobrenome termina com ler.",
            "hint": "Responda danielmiessler ou danielmiessler/SecLists.",
            "category": "wordlists"
        },
        {
            "id": 36,
            "title": "Repositório Weakpass",
            "difficulty": "fácil",
            "points": 50,
            "desc": "Qual é o domínio do site (URL) que permite baixar dicionários gigantescos ordenados por taxa de sucesso e eficiência?",
            "cmd": "",
            "help": "Útil para obter wordlists adaptadas para quebrar chaves WPA/WPA2 ou hashes complexos de Active Directory.",
            "hint": "Responda weakpass.com.",
            "category": "wordlists"
        },
        {
            "id": 37,
            "title": "Criando Dicionários Web: Cewl",
            "difficulty": "médio",
            "points": 100,
            "desc": "Qual ferramenta em linha de comando no Kali varre um site web (spider) e gera uma wordlist baseada no conteúdo textual das páginas do site?",
            "cmd": "cewl --help",
            "help": "Excelente para quebrar senhas corporativas onde funcionários tendem a usar termos relacionados à própria empresa.",
            "hint": "Escreva cewl em minúsculas.",
            "category": "wordlists"
        },
        {
            "id": 38,
            "title": "Gerador por Padrões: Crunch",
            "difficulty": "médio",
            "points": 100,
            "desc": "Qual utilitário do Kali Linux gera dicionários de senhas de forma determinística especificando tamanhos mínimos/máximos e conjuntos de caracteres?",
            "cmd": "crunch 4 6 abcdef123 -o wordlist.txt",
            "help": "Útil quando você conhece o formato da senha (ex: inicia com 'a', tem 5 caracteres e termina com um número) e quer gerar todas as possibilidades.",
            "hint": "Responda crunch.",
            "category": "wordlists"
        },
        {
            "id": 39,
            "title": "Wordlist Reduzida do John",
            "difficulty": "difícil",
            "points": 150,
            "desc": "Qual é o nome do arquivo de wordlist curta padrão (contendo apenas senhas comuns) utilizada pelo John the Ripper quando nenhum dicionário é fornecido?",
            "cmd": "ls /usr/share/john/ ou /etc/john/",
            "help": "O John recorre a este dicionário básico interno para testes de velocidade iniciais rápidos.",
            "hint": "Chama-se password.lst ou john.lst.",
            "category": "wordlists"
        },
        {
            "id": 40,
            "title": "Arquivo de Regras do John",
            "difficulty": "difícil",
            "points": 150,
            "desc": "Qual arquivo é consultado pelo John para carregar as definições de regras de mangling sob o argumento <code>--rules</code>?",
            "cmd": "",
            "help": "Este arquivo mapeia os padrões como capitalização, substituição de caracteres (leet speak) e concatenação de números.",
            "hint": "Responda john.conf.",
            "category": "wordlists"
        }
    ];

    // --- ESTADO LOCAL ---
    let solvedChallenges = JSON.parse(localStorage.getItem('passcrack_solved')) || [];
    let hintsUsed = parseInt(localStorage.getItem('passcrack_hints')) || 0;
    const maxHints = 5;

    // --- CONSOLE E LOGS ---
    let logBuffer = [];
    let isLogPaused = false;
    let sseSource = null;

    // --- ELEMENTOS DO DOM ---
    const elements = {
        navButtons: document.querySelectorAll('.nav-btn'),
        panes: document.querySelectorAll('.content-pane'),
        challengesContainer: document.getElementById('challenges-container'),
        progressFill: document.getElementById('progress-fill'),
        progressPercent: document.getElementById('progress-percent'),
        progressFraction: document.getElementById('progress-fraction'),
        
        // Status Topo
        statsScoreHeader: document.getElementById('stats-score-header'),
        statusPrivilege: document.getElementById('status-privilege'),
        
        // Stats Dashboard
        statsLoginsCount: document.getElementById('stats-logins-count'),
        statsBruteCount: document.getElementById('stats-brute-count'),
        statsCompleted: document.getElementById('stats-completed'),
        statsScore: document.getElementById('stats-score'),
        
        // Desempenho
        perfTotalScore: document.getElementById('perf-total-score'),
        perfCompletionPct: document.getElementById('perf-completion-pct'),
        perfSolvedFraction: document.getElementById('perf-solved-fraction'),
        perfHackerProfile: document.getElementById('perf-hacker-profile'),
        perfHackerDesc: document.getElementById('perf-hacker-desc'),
        
        // Barras Desempenho
        barPctEncodings: document.getElementById('bar-pct-encodings'),
        barFillEncodings: document.getElementById('bar-fill-encodings'),
        barPctJohn: document.getElementById('bar-pct-john'),
        barFillJohn: document.getElementById('bar-fill-john'),
        barPctHashcat: document.getElementById('bar-pct-hashcat'),
        barFillHashcat: document.getElementById('bar-fill-hashcat'),
        barPctWordlists: document.getElementById('bar-pct-wordlists'),
        barFillWordlists: document.getElementById('bar-fill-wordlists'),
        
        perfStrengthsList: document.getElementById('perf-strengths-list'),
        perfWeaknessesList: document.getElementById('perf-weaknesses-list'),
        
        // Controles de CTF e Dicas
        hintsCount: document.getElementById('hints-count'),
        btnResetCtf: document.getElementById('btn-reset-ctf'),
        filterModule: document.getElementById('filter-module'),
        filterDifficulty: document.getElementById('filter-difficulty'),
        searchChallenge: document.getElementById('search-challenge'),
        
        // Logs Auditoria
        idsLogsContainer: document.getElementById('ids-logs-container'),
        btnClearLogs: document.getElementById('btn-clear-logs'),
        btnPauseLogs: document.getElementById('btn-pause-logs'),
        idsFilterSelect: document.getElementById('ids-filter-select'),
        idsStatusDot: document.getElementById('ids-status-dot'),
        idsStatusText: document.getElementById('ids-status-text')
    };

    // --- NAVEGAÇÃO ENTRE PÁGINAS ---
    elements.navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.getAttribute('data-target');
            
            elements.navButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            elements.panes.forEach(pane => {
                pane.classList.remove('active');
                if (pane.id === `pane-${target}`) {
                    pane.classList.add('active');
                }
            });
        });
    });

    // --- NAVEGAÇÃO DE SUB-ABAS (TEORIA E TOOLKITS) ---
    document.querySelectorAll('.tabs-nav').forEach(nav => {
        nav.addEventListener('click', (e) => {
            if (e.target.classList.contains('tab-btn')) {
                const targetTabId = e.target.getAttribute('data-tab');
                const tabsContainer = nav.parentElement;
                
                // Remove active de todos os botões e abas sob o mesmo pai
                nav.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
                e.target.classList.add('active');
                
                tabsContainer.querySelectorAll('.tab-content').forEach(content => {
                    content.classList.remove('active');
                    if (content.id === targetTabId) {
                        content.classList.add('active');
                    }
                });
            }
        });
    });

    // --- BUSCA E FILTROS DE DESAFIOS ---
    const updateChallengeVisibility = () => {
        const catFilter = elements.filterModule.value;
        const diffFilter = elements.filterDifficulty.value;
        const searchTerm = elements.searchChallenge.value.toLowerCase().trim();
        
        document.querySelectorAll('.challenge-card').forEach(card => {
            const id = card.getAttribute('data-id');
            const category = card.getAttribute('data-category');
            const difficulty = card.getAttribute('data-difficulty');
            const title = card.querySelector('h4').textContent.toLowerCase();
            
            const matchCat = (catFilter === 'all' || category === catFilter);
            const matchDiff = (diffFilter === 'all' || difficulty === diffFilter);
            const matchSearch = (!searchTerm || id === searchTerm || title.includes(searchTerm));
            
            if (matchCat && matchDiff && matchSearch) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    };

    [elements.filterModule, elements.filterDifficulty].forEach(select => {
        select.addEventListener('change', updateChallengeVisibility);
    });
    elements.searchChallenge.addEventListener('input', updateChallengeVisibility);

    // --- RENDERIZAÇÃO DOS DESAFIOS (CTF) ---
    const renderChallenges = () => {
        elements.challengesContainer.innerHTML = '';
        
        ALL_CHALLENGES.forEach((ch, index) => {
            const isSolved = solvedChallenges.includes(ch.id);
            // Um desafio está desbloqueado se for o primeiro da sua categoria ou se o anterior da mesma categoria estiver resolvido
            const catChallenges = ALL_CHALLENGES.filter(c => c.category === ch.category);
            const relativeIdx = catChallenges.findIndex(c => c.id === ch.id);
            
            let isUnlocked = false;
            if (relativeIdx === 0) {
                isUnlocked = true;
            } else {
                const prevChallenge = catChallenges[relativeIdx - 1];
                isUnlocked = solvedChallenges.includes(prevChallenge.id);
            }
            
            // Renderiza Card
            const card = document.createElement('div');
            card.className = `challenge-card ${isSolved ? 'solved-state' : isUnlocked ? 'unlocked-state' : 'locked-state'}`;
            card.setAttribute('data-id', ch.id);
            card.setAttribute('data-category', ch.category);
            card.setAttribute('data-difficulty', ch.difficulty);
            
            let statusBadge = "Bloqueado";
            if (isSolved) statusBadge = "Resolvido";
            else if (isUnlocked) statusBadge = "Pendente";
            
            card.innerHTML = `
                <div class="challenge-header">
                    <span class="status-badge">${statusBadge}</span>
                    <span class="points">${ch.points} Pts</span>
                    <h4>Nível ${ch.id}: ${ch.title}</h4>
                    <span class="diff-tag text-muted" style="text-transform: capitalize; font-size: 0.78rem;">[${ch.difficulty}]</span>
                </div>
                <div class="challenge-body">
                    <p class="ch-description">${ch.desc}</p>
                    
                    ${(ch.cmd && isSolved) ? `
                    <div class="code-copy">
                        <code>${ch.cmd}</code>
                        <button class="btn-copy" onclick="navigator.clipboard.writeText('${ch.cmd.replace(/'/g, "\\'")}')">Copiar</button>
                    </div>
                    ` : ''}
                    
                    <div class="accordion-item" style="margin: 1rem 0;">
                        <h5>📚 Guia de Criptoanálise</h5>
                        <p>${ch.help}</p>
                    </div>

                    <div class="flag-section">
                        <label for="flag-input-${ch.id}">Sua resposta ou Flag:</label>
                        <div class="flag-input-group">
                            <input type="text" id="flag-input-${ch.id}" class="cyber-input" placeholder="Ex: FLAG{...} ou termo de resposta" ${isSolved ? 'disabled' : ''}>
                            <button class="btn btn-primary btn-submit-flag" data-id="${ch.id}" ${isSolved ? 'disabled' : ''}>Submeter</button>
                            <button class="btn btn-secondary btn-hint" data-id="${ch.id}" ${isSolved ? 'disabled' : ''}>Dica</button>
                        </div>
                        <div class="feedback-msg" id="feedback-${ch.id}"></div>
                    </div>
                </div>
            `;
            
            // Expandir / Recolher Card ao clicar no Header (se desbloqueado)
            const header = card.querySelector('.challenge-header');
            header.addEventListener('click', () => {
                if (!isUnlocked && !isSolved) {
                    alert("Atenção: Este nível está bloqueado! Resolva os níveis anteriores desta mesma categoria para desbloquear.");
                    return;
                }
                card.classList.toggle('expanded');
            });
            
            elements.challengesContainer.appendChild(card);
        });

        // Configurar botões de submissão
        document.querySelectorAll('.btn-submit-flag').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(btn.getAttribute('data-id'));
                const input = document.getElementById(`flag-input-${id}`);
                const flagVal = input.value.trim();
                submitFlag(id, flagVal);
            });
        });

        // Configurar botões de dicas
        document.querySelectorAll('.btn-hint').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(btn.getAttribute('data-id'));
                revealHint(id);
            });
        });
        
        updateChallengeVisibility();
    };

    // --- REVELAR DICAS ---
    const revealHint = (id) => {
        const ch = ALL_CHALLENGES.find(c => c.id === id);
        const feedback = document.getElementById(`feedback-${id}`);
        
        if (hintsUsed >= maxHints) {
            feedback.className = "feedback-msg error";
            feedback.innerHTML = `⚠️ Limite máximo de dicas (${maxHints}) atingido!`;
            return;
        }
        
        if (confirm("Gostaria de usar uma dica? Seu saldo de dicas sofrerá decréscimo.")) {
            hintsUsed++;
            localStorage.setItem('passcrack_hints', hintsUsed);
            elements.hintsCount.textContent = `${hintsUsed}/${maxHints}`;
            
            feedback.className = "feedback-msg text-warning";
            feedback.innerHTML = `💡 DICA: ${ch.hint}`;
        }
    };

    // --- SUBMETER FLAGS AO SERVIDOR Python ---
    const submitFlag = (id, flagVal) => {
        const feedback = document.getElementById(`feedback-${id}`);
        feedback.innerHTML = "Verificando resposta...";
        feedback.className = "feedback-msg";
        
        fetch('/api/submit-flag', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ challenge_id: id, flag: flagVal })
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                feedback.className = "feedback-msg success";
                feedback.innerHTML = `✔️ ${data.message}`;
                
                // Registrar resolvido localmente
                if (!solvedChallenges.includes(id)) {
                    solvedChallenges.push(id);
                    localStorage.setItem('passcrack_solved', JSON.stringify(solvedChallenges));
                }
                
                // Recarregar desafios e recalcular pontuações
                setTimeout(() => {
                    renderChallenges();
                    calculateProgress();
                }, 1000);
            } else {
                feedback.className = "feedback-msg error";
                feedback.innerHTML = `❌ ${data.message}`;
            }
        })
        .catch(err => {
            feedback.className = "feedback-msg error";
            feedback.innerHTML = "Erro ao se comunicar com o servidor de validação.";
            console.error(err);
        });
    };

    // --- ATUALIZAR STATUS DO SERVIDOR E PRIVILÉGIOS ---
    const checkServerStatus = () => {
        fetch('/api/status')
        .then(res => res.json())
        .then(data => {
            // Privilégios
            if (data.running_as_root) {
                elements.statusPrivilege.innerHTML = '<span class="text-success">Root (Sudo)</span>';
            } else {
                elements.statusPrivilege.innerHTML = '<span class="text-warning">Usuário (8080)</span>';
            }
            
            // Portas e status
            document.getElementById('status-ssh').innerHTML = `<span class="label">SSH (9022):</span> <span class="value text-success">Ativo</span>`;
            document.getElementById('status-ftp').innerHTML = `<span class="label">FTP (9021):</span> <span class="value text-success">Ativo</span>`;
            document.getElementById('status-hash-port').innerHTML = `<span class="label">Hash TCP (9005):</span> <span class="value text-success">Ativa</span>`;
        })
        .catch(() => {
            elements.statusPrivilege.innerHTML = '<span class="text-danger">Offline</span>';
        });
    };

    // --- CÁLCULOS DE PROGRESSO E GRÁFICOS ---
    const calculateProgress = () => {
        const totalChallenges = ALL_CHALLENGES.length;
        const solvedCount = solvedChallenges.length;
        const completionPct = totalChallenges > 0 ? Math.round((solvedCount / totalChallenges) * 100) : 0;
        
        // Somar pontos das corretas
        let score = 0;
        solvedChallenges.forEach(id => {
            const ch = ALL_CHALLENGES.find(c => c.id === id);
            if (ch) score += ch.points;
        });

        // Atualizar Dashboard e Header
        elements.progressFill.style.width = `${completionPct}%`;
        elements.progressPercent.textContent = `${completionPct}% Concluído`;
        elements.progressFraction.textContent = `${solvedCount}/${totalChallenges} Resolvidos`;
        
        elements.statsScoreHeader.textContent = `${score} Pts`;
        elements.statsCompleted.textContent = `${solvedCount}/${totalChallenges}`;
        elements.statsScore.textContent = score;
        
        // Aba Desempenho
        elements.perfTotalScore.textContent = `${score} Pts`;
        elements.perfCompletionPct.textContent = `${completionPct}%`;
        elements.perfSolvedFraction.textContent = `${solvedCount} de ${totalChallenges} resolvidos`;
        
        // Perfil do Aluno e Descrições baseadas na pontuação
        let profile = "Script Kiddie";
        let desc = "Iniciando na arte de quebrar hashes. Pratique comandos básicos.";
        
        if (score >= 1800) {
            profile = "Hashcat Master";
            desc = "Domínio total de aceleração por GPU, regras de mutação e ataques corporativos!";
        } else if (score >= 1000) {
            profile = "John of the Hill";
            desc = "Muito experiente em derivar padrões complexos de hashes locais e Unix.";
        } else if (score >= 400) {
            profile = "Hash Hacker";
            desc = "Sabe identificar algoritmos de hashes e trabalhar com codificações e bases.";
        }
        
        elements.perfHackerProfile.textContent = profile;
        elements.perfHackerDesc.textContent = desc;

        // Porcentagens por Categoria
        const categories = ['encodings', 'john', 'hashcat', 'wordlists'];
        const domainPct = {};
        
        categories.forEach(cat => {
            const catChs = ALL_CHALLENGES.filter(c => c.category === cat);
            const catSolved = catChs.filter(c => solvedChallenges.includes(c.id)).length;
            const pct = catChs.length > 0 ? Math.round((catSolved / catChs.length) * 100) : 0;
            domainPct[cat] = pct;
        });

        // Atualizar as barras da aba de desempenho
        elements.barPctEncodings.textContent = `${domainPct.encodings}%`;
        elements.barFillEncodings.style.width = `${domainPct.encodings}%`;
        elements.barPctJohn.textContent = `${domainPct.john}%`;
        elements.barFillJohn.style.width = `${domainPct.john}%`;
        elements.barPctHashcat.textContent = `${domainPct.hashcat}%`;
        elements.barFillHashcat.style.width = `${domainPct.hashcat}%`;
        elements.barPctWordlists.textContent = `${domainPct.wordlists}%`;
        elements.barFillWordlists.style.width = `${domainPct.wordlists}%`;

        // Fortes e Fracos
        elements.perfStrengthsList.innerHTML = '';
        elements.perfWeaknessesList.innerHTML = '';
        
        let hasStrengths = false;
        let hasWeaknesses = false;

        const friendlyNames = {
            encodings: "Encodings & Identificação",
            john: "John the Ripper",
            hashcat: "Hashcat",
            wordlists: "Wordlists & Recon"
        };

        categories.forEach(cat => {
            const pct = domainPct[cat];
            const name = friendlyNames[cat];
            
            if (pct >= 70) {
                const li = document.createElement('li');
                li.innerHTML = `✔️ <strong>${name}</strong> (${pct}% de acerto)`;
                elements.perfStrengthsList.appendChild(li);
                hasStrengths = true;
            } else {
                const li = document.createElement('li');
                li.innerHTML = `⚠️ <strong>${name}</strong> (Falta progresso: ${pct}% concluído)`;
                elements.perfWeaknessesList.appendChild(li);
                hasWeaknesses = true;
            }
        });

        if (!hasStrengths) {
            elements.perfStrengthsList.innerHTML = '<li>Nenhuma categoria dominada ainda (alcance pelo menos 70% de acerto).</li>';
        }
        if (!hasWeaknesses) {
            elements.perfWeaknessesList.innerHTML = '<li>Perfeito! Todas as categorias concluídas com excelência!</li>';
        }
    };

    // --- RE-CONECTAR E GERENCIAR LOGS SSE ---
    const initSSE = () => {
        if (sseSource) {
            sseSource.close();
        }
        
        sseSource = new EventSource('/api/auth-logs');
        
        sseSource.onmessage = (event) => {
            if (isLogPaused) return;
            
            try {
                const log = JSON.parse(event.data);
                logBuffer.push(log);
                if (logBuffer.length > 250) logBuffer.shift();
                
                // Incrementar estatísticas do dashboard com base nas tentativas
                let currentLogins = parseInt(elements.statsLoginsCount.textContent) || 0;
                elements.statsLoginsCount.textContent = currentLogins + 1;
                
                if (log.status === "FALHA") {
                    let currentBrute = parseInt(elements.statsBruteCount.textContent) || 0;
                    // Se houver muitas falhas acumuladas, conta como bruto
                    if (currentLogins % 5 === 0) {
                        elements.statsBruteCount.textContent = currentBrute + 1;
                    }
                }
                
                renderLogs();
            } catch (e) {
                console.error("Erro ao analisar log do SSE:", e);
            }
        };

        sseSource.onerror = () => {
            elements.idsStatusDot.className = "pulse-indicator-small red-glow";
            elements.idsStatusText.textContent = "Conexão de auditoria falhou. Tentando reconectar...";
            setTimeout(initSSE, 5000);
        };

        elements.idsStatusDot.className = "pulse-indicator-small green-glow";
        elements.idsStatusText.textContent = "Monitorando logs de auditoria dos serviços locais...";
    };

    const renderLogs = () => {
        const filterVal = elements.idsFilterSelect.value;
        const container = elements.idsLogsContainer;
        container.innerHTML = '';
        
        const filtered = logBuffer.filter(log => {
            if (filterVal === 'all') return true;
            return log.service.includes(filterVal);
        });

        if (filtered.length === 0) {
            container.innerHTML = '<div class="empty-logs">Nenhum log encontrado para o filtro selecionado...</div>';
            return;
        }

        // Mostrar de forma reversa (mais recentes no topo)
        filtered.slice().reverse().forEach(log => {
            const row = document.createElement('div');
            row.className = 'log-row';
            
            const isSuccess = log.status === "SUCESSO";
            const statusClass = isSuccess ? 'status-sucesso' : 'status-falha';
            
            row.innerHTML = `
                <div class="col-time">${log.timestamp}</div>
                <div class="col-origem">${log.service}</div>
                <div class="col-destino">${log.username}</div>
                <div class="col-flags ${statusClass}">${log.status}</div>
                <div class="col-desc">IP: ${log.client_ip} | Senha testada: <strong>${log.password}</strong> | ${log.details}</div>
            `;
            
            container.appendChild(row);
        });
    };

    // --- CONTROLES DOS LOGS ---
    elements.btnClearLogs.addEventListener('click', () => {
        logBuffer = [];
        renderLogs();
        elements.statsLoginsCount.textContent = 0;
        elements.statsBruteCount.textContent = 0;
    });

    elements.btnPauseLogs.addEventListener('click', () => {
        isLogPaused = !isLogPaused;
        if (isLogPaused) {
            elements.btnPauseLogs.textContent = "Retomar Captura";
            elements.btnPauseLogs.className = "btn btn-primary";
            elements.idsStatusText.textContent = "Auditoria pausada pelo usuário.";
        } else {
            elements.btnPauseLogs.textContent = "Pausar Captura";
            elements.btnPauseLogs.className = "btn btn-secondary";
            elements.idsStatusText.textContent = "Monitorando logs de auditoria dos serviços locais...";
            renderLogs();
        }
    });

    elements.idsFilterSelect.addEventListener('change', renderLogs);

    // --- RESET DO CTF ---
    elements.btnResetCtf.addEventListener('click', () => {
        if (confirm("Atenção! Você está prestes a apagar todo o seu progresso neste laboratório. Deseja continuar?")) {
            solvedChallenges = [];
            hintsUsed = 0;
            localStorage.removeItem('passcrack_solved');
            localStorage.removeItem('passcrack_hints');
            
            elements.hintsCount.textContent = "0/5";
            renderChallenges();
            calculateProgress();
        }
    });

    // --- INICIALIZAÇÃO GERAL ---
    elements.hintsCount.textContent = `${hintsUsed}/${maxHints}`;
    renderChallenges();
    calculateProgress();
    checkServerStatus();
    initSSE();
    
    // Check de status periódico
    setInterval(checkServerStatus, 10000);
});

// --- LIVE TOOL: BASE CONVERTER ---
window.convertBase = function(action) {
    const input = document.getElementById('base-input').value.trim();
    const outputField = document.getElementById('base-output');
    
    if (!input) {
        outputField.value = "Por favor, digite uma entrada válida para converter.";
        return;
    }
    
    try {
        if (action === 'encode64') {
            outputField.value = btoa(unescape(encodeURIComponent(input)));
        } else if (action === 'decode64') {
            outputField.value = decodeURIComponent(escape(atob(input)));
        } else if (action === 'encode32') {
            outputField.value = base32Encode(input);
        } else if (action === 'decode32') {
            outputField.value = base32Decode(input);
        } else if (action === 'encodeHex') {
            outputField.value = asciiToHex(input);
        } else if (action === 'decodeHex') {
            outputField.value = hexToAscii(input);
        } else if (action === 'encodeBin') {
            outputField.value = asciiToBin(input);
        } else if (action === 'decodeBin') {
            outputField.value = binToAscii(input);
        } else if (action === 'rot13') {
            outputField.value = rot13(input);
        }
    } catch (e) {
        outputField.value = `[!] Erro na conversão: formato de entrada inválido para a operação solicitada.`;
    }
};

// Helpers de Conversão Javascript
function asciiToBin(str) {
    let arr = [];
    for (let i = 0; i < str.length; i++) {
        let bin = Number(str.charCodeAt(i)).toString(2);
        arr.push(bin.padStart(8, '0'));
    }
    return arr.join(' ');
}

function binToAscii(binStr) {
    let bin = binStr.replace(/\s+/g, ''); // Remove todos os espaços
    let str = '';
    for (let i = 0; i < bin.length; i += 8) {
        let byte = bin.substr(i, 8);
        if (byte.length === 8) {
            str += String.fromCharCode(parseInt(byte, 2));
        }
    }
    return str;
}

function asciiToHex(str) {
    let arr = [];
    for (let i = 0, l = str.length; i < l; i++) {
        let hex = Number(str.charCodeAt(i)).toString(16);
        arr.push(hex.padStart(2, '0'));
    }
    return arr.join('');
}

function hexToAscii(hexx) {
    let hex = hexx.replace(/\s+/g, ''); // Remove espaços
    let str = '';
    for (let i = 0; i < hex.length; i += 2) {
        str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    }
    return str;
}

function rot13(str) {
    return str.replace(/[a-zA-Z]/g, function(c) {
        return String.fromCharCode((c <= "Z" ? 90 : 122) >= (c = c.charCodeAt(0) + 13) ? c : c - 26);
    });
}

// Codificador/Decodificador Base32 RFC 4648 em puro Javascript
const b32Alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";

function base32Encode(str) {
    let bits = "";
    for (let i = 0; i < str.length; i++) {
        let bin = str.charCodeAt(i).toString(2);
        bits += bin.padStart(8, '0');
    }
    let encoded = "";
    for (let i = 0; i < bits.length; i += 5) {
        let chunk = bits.substr(i, 5);
        if (chunk.length < 5) {
            chunk = chunk.padEnd(5, '0');
        }
        encoded += b32Alphabet[parseInt(chunk, 2)];
    }
    // Adiciona padding '='
    let pad = (str.length * 8) % 5;
    if (pad === 1) encoded += "======";
    else if (pad === 2) encoded += "====";
    else if (pad === 3) encoded += "===";
    else if (pad === 4) encoded += "=";
    
    return encoded;
}

function base32Decode(str) {
    let clean = str.replace(/=/g, '').toUpperCase();
    let bits = "";
    for (let i = 0; i < clean.length; i++) {
        let val = b32Alphabet.indexOf(clean[i]);
        if (val === -1) throw new Error("Caractere inválido Base32");
        bits += val.toString(2).padStart(5, '0');
    }
    let decoded = "";
    for (let i = 0; i < bits.length; i += 8) {
        let chunk = bits.substr(i, 8);
        if (chunk.length === 8) {
            decoded += String.fromCharCode(parseInt(chunk, 2));
        }
    }
    return decoded;
}

// --- LIVE TOOL: HASH IDENTIFIER ---
window.identifyHash = function() {
    const input = document.getElementById('hash-input').value.trim();
    const resultBox = document.getElementById('hash-result');
    
    if (!input) {
        resultBox.style.display = 'block';
        resultBox.innerHTML = '<span class="text-danger">Por favor, insira um hash para identificar.</span>';
        return;
    }
    
    resultBox.style.display = 'block';
    resultBox.innerHTML = '<span class="text-primary">Analisando propriedades do hash...</span>';
    
    // Limpar hash de possíveis tags
    const cleanHash = input.replace(/\s+/g, '');
    const len = cleanHash.length;
    
    let possibleAlgorithms = [];
    
    // Heurísticas básicas de reconhecimento de hashes
    if (/^[0-9a-fA-F]{32}$/.test(cleanHash)) {
        possibleAlgorithms.push({ name: "MD5", bit: "128 bits", cat: "Hash Criptográfico Clássico", mode: "Hashcat mode: 0 | John format: raw-md5" });
        possibleAlgorithms.push({ name: "MD4", bit: "128 bits", cat: "Legado", mode: "Hashcat mode: 900 | John format: raw-md4" });
        possibleAlgorithms.push({ name: "NTLM", bit: "128 bits (NT Hash)", cat: "Autenticação Windows", mode: "Hashcat mode: 1000 | John format: nt" });
    } 
    else if (/^[0-9a-fA-F]{40}$/.test(cleanHash)) {
        possibleAlgorithms.push({ name: "SHA-1", bit: "160 bits", cat: "Hash Criptográfico", mode: "Hashcat mode: 100 | John format: raw-sha1" });
        possibleAlgorithms.push({ name: "MySQL5 / Double SHA-1", bit: "160 bits", cat: "Banco de Dados", mode: "Hashcat mode: 300 | John format: mysql-sha1" });
    }
    else if (/^[0-9a-fA-F]{56}$/.test(cleanHash)) {
        possibleAlgorithms.push({ name: "SHA-224", bit: "224 bits", cat: "Família SHA-2", mode: "Hashcat mode: 13000 | John format: raw-sha224" });
    }
    else if (/^[0-9a-fA-F]{64}$/.test(cleanHash)) {
        possibleAlgorithms.push({ name: "SHA-256", bit: "256 bits", cat: "Família SHA-2 (Padrão de Indústria)", mode: "Hashcat mode: 1400 | John format: raw-sha256" });
        possibleAlgorithms.push({ name: "SHA3-256", bit: "256 bits", cat: "Família SHA-3", mode: "Hashcat mode: 17400 | John format: raw-sha3-256" });
    }
    else if (/^[0-9a-fA-F]{96}$/.test(cleanHash)) {
        possibleAlgorithms.push({ name: "SHA-384", bit: "384 bits", cat: "Família SHA-2", mode: "Hashcat mode: 10800 | John format: raw-sha384" });
    }
    else if (/^[0-9a-fA-F]{128}$/.test(cleanHash)) {
        possibleAlgorithms.push({ name: "SHA-512", bit: "512 bits", cat: "Família SHA-2", mode: "Hashcat mode: 1700 | John format: raw-sha512" });
    }
    else if (cleanHash.startsWith('$2a$') || cleanHash.startsWith('$2y$') || cleanHash.startsWith('$2b$')) {
        possibleAlgorithms.push({ name: "bcrypt", bit: "Variável (Salted)", cat: "Derivação de Chave (Lento/Seguro)", mode: "Hashcat mode: 3200 | John format: bcrypt" });
    }
    else if (cleanHash.startsWith('$1$')) {
        possibleAlgorithms.push({ name: "MD5-Crypt (Apache/Unix)", bit: "128 bits", cat: "Unix Shadow", mode: "Hashcat mode: 500 | John format: md5crypt" });
    }
    else if (cleanHash.startsWith('$5$')) {
        possibleAlgorithms.push({ name: "SHA-256-Crypt", bit: "256 bits", cat: "Unix Shadow", mode: "Hashcat mode: 7400 | John format: sha256crypt" });
    }
    else if (cleanHash.startsWith('$6$')) {
        possibleAlgorithms.push({ name: "SHA-512-Crypt", bit: "512 bits", cat: "Unix/Linux Shadow Padrão", mode: "Hashcat mode: 1800 | John format: sha512crypt" });
    }
    else if (cleanHash.startsWith('$argon2i$') || cleanHash.startsWith('$argon2id$')) {
        possibleAlgorithms.push({ name: "Argon2", bit: "Variável", cat: "Vencedor do PHC (Custo Memória/CPU)", mode: "Hashcat mode: 22000 | John format: argon2" });
    }
    else if (cleanHash.startsWith('$pbkdf2-sha256$') || cleanHash.includes('sha256$')) {
        possibleAlgorithms.push({ name: "PBKDF2-HMAC-SHA256", bit: "Variável", cat: "Derivação de Chave padrão Django/WPA2", mode: "Hashcat mode: 10900 | John format: pbkdf2-hmac-sha256" });
    }

    if (possibleAlgorithms.length === 0) {
        resultBox.innerHTML = `
            <p style="color:var(--color-warning);">⚠️ Análise inconclusiva baseada em heurística direta.</p>
            <p style="margin-top:0.4rem; font-size:0.75rem; color:var(--color-text-muted);">Tamanho detectado: <strong>${len} caracteres</strong>.<br>Garanta que copiou o hash completo e sem espaços.</p>
        `;
        return;
    }

    let html = `
        <p class="text-success" style="font-weight:600; margin-bottom:0.5rem;">[+] Algoritmos Prováveis Encontrados (${possibleAlgorithms.length}):</p>
        <hr style="border-color:rgba(35,52,92,0.3); margin-bottom:0.5rem;">
    `;
    
    possibleAlgorithms.forEach(alg => {
        html += `
            <div style="margin-bottom:0.8rem;">
                <span style="color:#fff; font-size:0.9rem;">⭐ <strong>${alg.name}</strong></span> - <span class="text-primary">${alg.bit}</span><br>
                <span style="font-size:0.78rem; color:var(--color-text-muted);">Categoria: ${alg.cat}</span><br>
                <span class="text-accent" style="font-size:0.75rem; font-family:var(--font-mono);">${alg.mode}</span>
            </div>
        `;
    });
    
    resultBox.innerHTML = html;
};
