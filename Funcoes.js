document.addEventListener('DOMContentLoaded', () => {
    const conteudoDiv = document.getElementById('conteudo');
    const barraStatus = document.getElementById('barraStatus');
    const botoesFixos = document.getElementById('botoesFixos');

    // Popups
    const statusPopup = document.getElementById('statusPopup');
    const dadosPopup = document.getElementById('dadosPopup');
    const textoPopup = document.getElementById('textoPopup');

    // Status Popup Elements - Atributos
    const inputHabilidade = document.getElementById('inputHabilidade');
    const ajusteHabilidade = document.getElementById('ajusteHabilidade');
    const inputEnergia = document.getElementById('inputEnergia');
    const ajusteEnergia = document.getElementById('ajusteEnergia');
    const inputSorte = document.getElementById('inputSorte');
    const ajusteSorte = document.getElementById('ajusteSorte');
    const inputOuro = document.getElementById('inputOuro');
    const ajusteOuro = document.getElementById('ajusteOuro');

    // Status Popup Elements - Inventário
    const listaMagias = document.getElementById('listaMagias');
    const inputMagia = document.getElementById('inputMagia');
    const addMagiaBtn = document.getElementById('addMagia');

    const listaEncantos = document.getElementById('listaEncantos');
    const inputEncanto = document.getElementById('inputEncanto');
    const addEncantoBtn = document.getElementById('addEncanto');

    const listaEquipamentos = document.getElementById('listaEquipamentos');
    const inputEquipamento = document.getElementById('inputEquipamento');
    const addEquipamentoBtn = document.getElementById('addEquipamento');

    // Fixed Buttons (Rodapé)
    const btnStatus = document.getElementById('btnStatus');
    const btnDados = document.getElementById('btnDados');
    const btnSalvarJogo = document.getElementById('btnSalvarJogo');
    const btnCarregarJogo = document.getElementById('btnCarregarJogo');

    // Display for fixed status bar
    const displayHabilidade = document.getElementById('displayHabilidade');
    const displayEnergia = document.getElementById('displayEnergia');
    const displaySorte = document.getElementById('displaySorte');
    const displayOuro = document.getElementById('displayOuro');

    let aventuraData = {}; // Variável para armazenar o JSON da aventura
    let jogador = {
        habilidadeInicial: null,
        energiaInicial: null,
        sorteInicial: null,
        ouroInicial: null,
        habilidadeAtual: 0,
        energiaAtual: 0,
        sorteAtual: 0,
        ouroAtual: 0,
        magias: [],
        encantos: [],
        equipamentos: []
    };

    // --- Popup Management ---
    function openPopup(popupElement) {
        popupElement.classList.remove('hidden');
        // NOVO: Anexar listener do botão Resetar ao abrir o statusPopup
        if (popupElement === statusPopup) {
            setupResetButtonListener(); // Chama a função para configurar o listener
        }
    }

    function closePopup(popupElement) {
        popupElement.classList.add('hidden');
    }

    // Generic close for clicking outside
    document.querySelectorAll('.popup-overlay').forEach(overlay => {
        overlay.addEventListener('click', (event) => {
            if (event.target === overlay) {
                if (overlay === statusPopup) {
                    carregarFicha(); // Discard unsaved changes by reloading from localStorage
                }
                closePopup(overlay);
            }
        });
    });

    document.getElementById('btnFecharStatus').addEventListener('click', () => {
        carregarFicha(); // Discard unsaved changes by reloading from localStorage
        closePopup(statusPopup);
    });
    document.getElementById('btnFecharDados').addEventListener('click', () => closePopup(dadosPopup));
    document.getElementById('btnFecharTextoPopup').addEventListener('click', () => closePopup(textoPopup));

    // --- Player State Management ---
    function salvarFicha() {
        // Apenas fixa o valor inicial se ainda não foi fixado e o input tem um valor
        if (inputHabilidade.value !== '' && jogador.habilidadeInicial === null) jogador.habilidadeInicial = parseInt(inputHabilidade.value);
        if (inputEnergia.value !== '' && jogador.energiaInicial === null) jogador.energiaInicial = parseInt(inputEnergia.value);
        if (inputSorte.value !== '' && jogador.sorteInicial === null) jogador.sorteInicial = parseInt(inputSorte.value);
        if (inputOuro.value !== '' && jogador.ouroInicial === null) jogador.ouroInicial = parseInt(inputOuro.value);

        // Atualiza os valores atuais
        jogador.habilidadeAtual = parseInt(ajusteHabilidade.value) || 0;
        jogador.energiaAtual = parseInt(ajusteEnergia.value) || 0;
        jogador.sorteAtual = parseInt(ajusteSorte.value) || 0;
        jogador.ouroAtual = parseInt(ajusteOuro.value) || 0;

        localStorage.setItem('jogador', JSON.stringify(jogador));
        atualizarDisplayStatus();
        console.log("Ficha salva automaticamente:", jogador); // Log para depuração
    }

    function carregarFicha() {
        const savedJogador = localStorage.getItem('jogador');
        if (savedJogador) {
            jogador = JSON.parse(savedJogador);
            console.log("Ficha carregada:", jogador); // Log para depuração
        } else {
            console.log("Nenhuma ficha salva encontrada, resetando estado."); // Log para depuração
            resetarFichaEstado(); // Garante que o estado inicial é carregado se não houver nada salvo
        }
        renderizarFichaNoPopup();
        atualizarDisplayStatus();
    }

    function resetarFichaEstado() {
        // Reseta todos os atributos do objeto jogador para seus valores iniciais/padrão
        jogador = {
            habilidadeInicial: null,
            energiaInicial: null,
            sorteInicial: null,
            ouroInicial: null,
            habilidadeAtual: 0,
            energiaAtual: 0,
            sorteAtual: 0,
            ouroAtual: 0,
            magias: [],
            encantos: [],
            equipamentos: []
        };
        // Remove os dados do jogador do localStorage
        localStorage.removeItem('jogador');
        console.log("Estado da ficha resetado e localStorage limpo."); // Log para depuração
    }

    function renderizarFichaNoPopup() {
        const attributes = ['habilidade', 'energia', 'sorte', 'ouro'];
        attributes.forEach(attr => {
            const inputInitial = document.getElementById(`input${attr.charAt(0).toUpperCase() + attr.slice(1)}`);
            const btnFixar = document.querySelector(`.btn-fixar[data-attr="${attr}"]`);
            const initialValue = jogador[`${attr}Inicial`];

            if (inputInitial && btnFixar) { // Verifica se os elementos existem antes de tentar manipulá-los
                if (initialValue !== null) {
                    inputInitial.value = initialValue;
                    inputInitial.disabled = true;
                    btnFixar.disabled = true;
                    btnFixar.style.backgroundColor = '#666';
                } else {
                    inputInitial.value = ''; // Limpa o valor se não houver valor inicial
                    inputInitial.disabled = false;
                    btnFixar.disabled = false;
                    btnFixar.style.backgroundColor = ''; // Remove estilo de desabilitado
                }
            }

            const ajusteCurrent = document.getElementById(`ajuste${attr.charAt(0).toUpperCase() + attr.slice(1)}`);
            if (ajusteCurrent) { // Verifica se o elemento existe
                ajusteCurrent.value = jogador[`${attr}Atual`];
            }
        });

        renderizarItens(listaMagias, jogador.magias, false); // Magias não são removíveis pelo usuário aqui
        renderizarItens(listaEncantos, jogador.encantos, true);
        renderizarItens(listaEquipamentos, jogador.equipamentos, true);
    }

    function renderizarItens(listElement, items, removable) {
        listElement.innerHTML = ''; // Limpa a lista antes de renderizar
        items.forEach((item, index) => {
            const li = document.createElement('li');
            li.textContent = item;

            if (removable) {
                const removeBtn = document.createElement('button');
                removeBtn.textContent = '✖';
                removeBtn.classList.add('remover-item');
                removeBtn.addEventListener('click', (event) => {
                    event.stopPropagation(); // Evita que o clique no botão se propague para o item da lista
                    items.splice(index, 1); // Remove o item do array
                    salvarFicha(); // Salva a ficha atualizada
                    // Re-renderiza a lista específica após a remoção
                    if (listElement === listaMagias) renderizarItens(listaMagias, jogador.magias, false);
                    else if (listElement === listaEncantos) renderizarItens(listaEncantos, jogador.encantos, true);
                    else if (listElement === listaEquipamentos) renderizarItens(listaEquipamentos, jogador.equipamentos, true);
                });
                li.appendChild(removeBtn);
            }
            listElement.appendChild(li);
        });
    }

    function atualizarDisplayStatus() {
        displayHabilidade.textContent = jogador.habilidadeAtual;
        displayEnergia.textContent = jogador.energiaAtual;
        displaySorte.textContent = jogador.sorteAtual;
        displayOuro.textContent = jogador.ouroAtual;
    }

    document.querySelectorAll('.btn-fixar').forEach(button => {
        button.addEventListener('click', (event) => {
            const attr = event.target.dataset.attr;
            const inputInitial = document.getElementById(`input${attr.charAt(0).toUpperCase() + attr.slice(1)}`);
            const value = parseInt(inputInitial.value);

            if (!isNaN(value)) {
                jogador[`${attr}Inicial`] = value;
                jogador[`${attr}Atual`] = value;
                inputInitial.disabled = true;
                event.target.disabled = true;
                event.target.style.backgroundColor = '#666'; // Visual de desabilitado
                salvarFicha();
            } else {
                alert(`Por favor, insira um valor numérico para ${attr}.`);
            }
        });
    });

    document.querySelectorAll('.btn-ajuste').forEach(button => {
        button.addEventListener('click', (event) => {
            const attr = event.target.dataset.attr;
            const adjustmentInput = document.getElementById(`ajuste${attr.charAt(0).toUpperCase() + attr.slice(1)}`);
            let currentValue = parseInt(adjustmentInput.value) || 0;
            const action = event.target.dataset.action;

            if (action === 'plus') {
                currentValue++;
            } else if (action === 'minus') {
                currentValue--;
            }
            adjustmentInput.value = currentValue;
            jogador[`${attr}Atual`] = currentValue;
            salvarFicha();
        });
    });

    // Listener para inputs de ajuste manual (digitação)
    document.querySelectorAll('.ajuste-atual').forEach(input => {
        input.addEventListener('change', (event) => {
            const attr = event.target.id.replace('ajuste', '').toLowerCase();
            const value = parseInt(event.target.value);
            if (!isNaN(value)) {
                jogador[`${attr}Atual`] = value;
                salvarFicha();
            } else {
                // Se o valor digitado não for um número, reset para o valor atual do jogador
                event.target.value = jogador[`${attr}Atual`];
            }
        });
    });

    function addItem(inputElement, itemArray, listElement, removable) {
        const item = inputElement.value.trim();
        if (item && !itemArray.includes(item)) { // Adiciona apenas se não for vazio e não duplicado
            itemArray.push(item);
            inputElement.value = ''; // Limpa o input
            salvarFicha();
            renderizarItens(listElement, itemArray, removable);
        }
    }

    addMagiaBtn.addEventListener('click', () => { addItem(inputMagia, jogador.magias, listaMagias, false); });
    addEncantoBtn.addEventListener('click', () => { addItem(inputEncanto, jogador.encantos, listaEncantos, true); });
    addEquipamentoBtn.addEventListener('click', () => { addItem(inputEquipamento, jogador.equipamentos, listaEquipamentos, true); });


    // --- FUNÇÃO PARA CONFIGURAR O LISTENER DO BOTÃO RESETAR FICHA ---
    // Esta função será chamada ao abrir o statusPopup.
    function setupResetButtonListener() {
        const btnResetarFicha = document.getElementById('btnResetarFicha');
        if (btnResetarFicha) {
            // REMOVE QUALQUER LISTENER ANTERIOR PARA EVITAR DUPLICAÇÃO DE EVENTOS
            btnResetarFicha.removeEventListener('click', handleResetClick);
            // ADICIONA O NOVO LISTENER
            btnResetarFicha.addEventListener('click', handleResetClick);
            console.log('Listener para btnResetarFicha ANEXADO na abertura do popup.');
        } else {
            console.warn('AVISO: btnResetarFicha não encontrado no DOM ao tentar configurar o listener. Verifique o HTML.');
        }
    }

    // Função de tratamento de clique separada para o reset
    function handleResetClick() {
        console.log('handleResetClick() invocado!'); // Log para saber se a função foi chamada
        if (confirm('Tem certeza que deseja resetar a ficha? Isso apagará todos os dados salvos.')) {
            console.log('Confirmação de reset: SIM.');
            resetarFichaEstado(); // Reseta o objeto jogador e o localStorage
            renderizarFichaNoPopup(); // Atualiza o popup de status com os valores resetados
            atualizarDisplayStatus(); // Atualiza a barra de status fixa
            alert('Ficha resetada!');
        } else {
            console.log('Confirmação de reset: CANCELADA.');
        }
    }
    // --- FIM DA FUNÇÃO DE CONFIGURAÇÃO DO BOTÃO RESETAR ---


    document.getElementById('btnRolarDados').addEventListener('click', () => {
        const dado1 = document.getElementById('dado1');
        const dado2 = document.getElementById('dado2');
        const resultadoDados = document.getElementById('resultadoDados');

        dado1.classList.add('rolando');
        dado2.classList.add('rolando');
        resultadoDados.textContent = ''; // Limpa o resultado anterior

        setTimeout(() => {
            const val1 = Math.floor(Math.random() * 6) + 1;
            const val2 = Math.floor(Math.random() * 6) + 1;
            const total = val1 + val2;

            dado1.textContent = val1;
            dado2.textContent = val2;
            resultadoDados.textContent = `Soma: ${total}`;

            dado1.classList.remove('rolando');
            dado2.classList.remove('rolando');
        }, 1000); // 1 segundo para a animação
    });

    // Definição das páginas de introdução do jogo
    const paginasIntroducao = [
        {
            id: 'capa',
            render: () => `
                <h1>A Cidadela do Caos</h1>
                <img src="capa.jpg" alt="Capa A Cidadela do Caos">
                <div class="botoes-navegacao">
                    <button data-target="introducao">Avançar</button>
                </div>
            `
        },
        {
            id: 'introducao',
            render: () => `
                <h2>Introdução</h2>
                <p>Nas profundezas da Cidadela do Caos, o terrível feiticeiro, Balthus Dire, está conspirando e planejando a derrocada do povo generoso do Vale dos Salgueiros. Seus planos de combate estão prontos, seu exército assustador equipado, e o ataque é indiscutivelmente iminente. Convocado por uma súplica desesperada de ajuda, <strong>VOCÊ</strong> é a única esperança do Vale dos Salgueiros. Aluno brilhante do Grande Mago de Yore e um mestre da magia, só você pode empreender uma missão que atinja o próprio coração do mundo de pesadelo de Balthus Dire. Que criaturas monstruosas esperam por você lá?</p>
                <p>Steve Jackson, co-fundador da Games Workshop, um sucesso absoluto, criou uma aventura emocionante de espada e feitiçaria para você, com um elaborado sistema de combate, uma variedade fascinante de encantos para usar e uma folha de resultados para registrar seus ganhos e perdas. Tudo que você precisa é de dois dados, um lápis e uma borracha.</p>
                <p>Muitos perigos existem à sua frente, e seu sucesso não está de forma alguma garantido. Há adversários poderosos nas fileiras do inimigo e muitas vezes sua única alternativa será matar ou ser morto!</p>
                <div class="botoes-navegacao">
                    <button data-target="comoLutar">Avançar</button>
                    <button data-target="capa">Voltar</button>
                </div>
            `
        },
        {
            id: 'comoLutar',
            render: () => `
                <h2>COMO LUTAR CONTRA AS CRIATURAS DA CIDADELA</h2>
                <p>As batalhas são uma parte crucial da sua jornada. Aqui estão as regras básicas para combate e os atributos que você usará:</p>
                <div class="botoes-interativos">
                    <button data-popup-title="Habilidade" data-popup-content="O seu índice de <strong>HABILIDADE</strong> reflete a sua capacidade como espadachim e sua aptidão geral como lutador. Para determinar sua HABILIDADE inicial, jogue um dado, some seis a este número e registre o total na sua Ficha de Status. Os índices de HABILIDADE mudam constantemente durante uma aventura, e você deve fazer um registro preciso. Nunca apague seu índice Inicial. Embora você possa conquistar pontos adicionais de HABILIDADE, este total nunca poderá exceder seu índice Inicial, a não ser em raríssimas ocasiões, quando haverá instruções específicas.">Habilidade</button>
                    <button data-popup-title="Energia" data-popup-content="O seu índice de <strong>ENERGIA</strong> reflete a sua constituição física geral, vontade de sobreviver, determinação e condição física como um todo; quanto mais alto for o seu índice de ENERGIA, mais tempo você conseguirá sobreviver. Para determinar sua ENERGIA inicial, jogue dois dados, some 12 ao número obtido e registre o total na sua Ficha de Status. Os índices de ENERGIA mudam constantemente durante uma aventura, e você deve fazer um registro preciso. Nunca apague seu índice Inicial. Embora você possa conquistar pontos adicionais de ENERGIA, este total nunca poderá exceder seu índice Inicial, a não ser em raríssimas ocasiões, quando haverá instruções específicas.">Energia</button>
                    <button data-popup-title="Sorte" data-popup-content="O seu índice de <strong>SORTE</strong> indica o quanto você é uma pessoa naturalmente de sorte. Sorte — e magia — são fatos da vida no reino da fantasia que você está prestes a explorar. Para determinar sua SORTE inicial, jogue um dado, some seis a este número e registre o total na sua Ficha de Status. Os índices de SORTE mudam constantemente durante uma aventura, e você deve fazer um registro preciso. Nunca apague seu índice Inicial. Embora você possa conquistar pontos adicionais de SORTE, este total nunca poderá exceder seu índice Inicial, a não ser em raríssimas ocasiões, quando haverá instruções específicas. Em diversos momentos da sua aventura, tanto durante as batalhas quanto nas situações em que você pode ter ou não sorte, você pode apelar para a sua sorte para tornar o resultado mais favorável. Mas tome cuidado! Usar a sorte é um negócio arriscado e, se você não tiver sorte, os resultados podem ser desastrosos. O procedimento para usar à sua sorte é o seguinte: jogue dois dados. Se o número obtido for igual ou menor do que o seu índice de SORTE atual, você teve sorte, e o resultado será a seu favor. Se o número obtido for maior do que o seu índice de SORTE atual, você não teve sorte e sofrerá as consequências. Este procedimento é conhecido como Testar a sua Sorte. Cada vez que você Testar a sua Sorte, terá que subtrair um ponto do seu índice de SORTE atual. Portanto, você logo compreenderá que quanto mais confiar na sua sorte, mais arriscado isso se tornará.">Sorte</button>
                    <button data-popup-title="Batalhas" data-popup-content="Frequentemente você encontrará páginas que o instruirão para que lute contra algum tipo de criatura. Talvez haja a alternativa de fugir ou usar um encanto mágico, mas se não houver — ou se você decidir atacar a criatura de qualquer maneira – você terá que resolver a batalha conforme descrito abaixo. Primeiro registre os índices de HABILIDADE e ENERGIA da criatura. Os índices de cada criatura são dados no jogo a cada vez que você tem um encontro. A sequência de combate é a seguinte: 1. Jogue os dois dados uma vez para a criatura. Some a seu índice de HABILIDADE. Este total é a Força de Ataque da criatura. 2. Jogue ambos os dados uma vez para você. Some o número obtido a seu índice atual de HABILIDADE. Este total é sua Força de Ataque. 3. Se sua Força de Ataque for maior do que a da criatura, você a feriu. Se a Força de Ataque da criatura for maior do que a sua, ela feriu você. Se os dois totais de Força de Ataque forem iguais, vocês se defenderam dos golpes – comece a próxima Série de Ataque a partir do item 1. 4. Se você tiver ferido a criatura, subtraia 2 pontos de seu índice de ENERGIA. Você pode usar sua SORTE aqui para causar maiores danos (ver na seção Sorte). 5. Se a criatura tiver ferido você, subtraia 2 pontos de seu próprio índice de ENERGIA. Também neste momento você pode usar a sua SORTE (ver na seção Sorte). 6. Faça os ajustes apropriados nos índices de ENERGIA, seu ou da criatura (e em seu índice de SORTE, se você tiver usado a SORTE - ver na seção Sorte). 7. Comece a próxima Série de Ataque retornando a seu índice de HABILIDADE atual, e depois repita os itens de 1 a 6. Esta sequência continua até que o índice de ENERGIA seu ou da criatura contra quem você está lutando tenha sido reduzido a zero (morte). Luta Contra mais de uma Criatura: Se você se defrontar com mais de uma criatura em um determinado encontro, as instruções dirão como lidar com a batalha. Às vezes você as tratarão como se fossem um único monstro; às vezes lutará contra um de cada vez.">Batalhas</button>
                    <button data-popup-title="Fuga" data-popup-content="Em algumas situações, pode ser dada a você a alternativa de fugir de uma batalha, caso as coisas estejam indo mal para o seu lado. Porém, se você realmente escapar, sofrerá automaticamente um ferimento causado pela criatura (subtraia 2 pontos de ENERGIA) na sua fuga. Este é o preço da covardia. Você pode usar a SORTE neste ferimento do modo normal (ver na seção Sorte). Você só pode Fugir se esta opção for especificamente dada no jogo.">Fuga</button>
                </div>
                <div class="botoes-navegacao">
                    <button data-target="recuperacao">Avançar</button>
                </div>
            `
        },
        {
            id: 'recuperacao',
            render: () => `
                <h2>Recuperação</h2>
                <p>Em sua jornada, você pode encontrar maneiras de recuperar seus atributos:</p>
                <div class="botoes-interativos">
                    <button data-popup-title="Recuperar Habilidade" data-popup-content="A Habilidade é raramente recuperada durante a aventura. Geralmente, é um valor fixo.">Habilidade</button>
                    <button data-popup-title="Recuperar Energia" data-popup-content="Você pode recuperar Energia encontrando poções de cura, descansando em locais seguros ou através de algumas magias.">Energia</button>
                    <button data-popup-title="Recuperar Sorte" data-popup-content="A Sorte pode ser recuperada em momentos de grande sucesso ou por eventos inesperados.">Sorte</button>
                </div>
                <div class="botoes-navegacao">
                    <button data-target="usoDeMagia">Avançar</button>
                </div>
            `
        },
        {
            id: 'usoDeMagia',
            render: () => `
                <h2>Uso de Magia</h2>
                <p>Como um feiticeiro, você tem acesso a diversas magias que podem auxiliá-lo em sua jornada. Cada magia tem um efeito único e pode ser usada em momentos específicos.</p>
                <div class="botoes-navegacao">
                    <button data-target="encantos">Avançar</button>
                </div>
            `
        },
        {
            id: 'encantos',
            render: () => `
                <h2>Encantos</h2>
                <p>Os encantos são magias que você pode aprender e usar. Cada um tem um custo e um efeito. Escolha sabiamente!</p>
                <div class="botoes-interativos">
                    <button data-popup-title="Cópia de Criatura" data-popup-content="Cria uma ilusão perfeita de uma criatura por alguns minutos, enganando inimigos (Custo: 2 Energia, 1 Sorte).">Cópia de Criatura</button>
                    <button data-popup-title="Percepção Extrassensorial" data-popup-content="Permite que você sinta a presença de inimigos ocultos ou armadilhas por perto (Custo: 1 Energia).">Percepção Extrassensorial</button>
                    <button data-popup-title="Escudo Místico" data-popup-content="Cria uma barreira mágica que absorve 2 pontos de dano em um combate (Custo: 3 Energia).">Escudo Místico</button>
                    <button data-popup-title="Toque Restaurador" data-popup-content="Cura 1 ponto de Energia (Custo: 1 Energia, só pode ser usada uma vez por dia).">Toque Restaurador</button>
                    <button data-popup-title="Nuvem de Cegueira" data-popup-content="Cria uma nuvem de fumaça mágica que cega temporariamente inimigos próximos, permitindo fuga (Custo: 2 Sorte).">Nuvem de Cegueira</button>
                </div>
                <div class="botoes-navegacao">
                    <button data-target="equipamentos">Avançar</button>
                </div>
            `
        },
        {
            id: 'equipamentos',
            render: () => `
                <h2>Equipamentos</h2>
                <p>Seu equipamento é vital para a sua sobrevivência. Escolha com cuidado o que levará consigo para a cidadela.</p>
                <p><strong>Neste ponto, sua ficha de status e os botões fixos estarão visíveis. Preencha sua ficha para começar a aventura!</strong></p>
                <div class="botoes-navegacao">
                    <button data-target="historia_intro">Entrar na Cidadela</button>
                </div>
            `,
            onEnter: () => {
                barraStatus.classList.remove('hidden');
                botoesFixos.classList.remove('hidden');
                salvarFicha(); // Save initial state when entering the game
            }
        }
    ];

    let currentPageId = 'capa'; // Página inicial do jogo

    function navigateToPage(pageId) {
        // Verifica se é uma página de introdução
        if (paginasIntroducao.some(p => p.id === pageId)) {
            const page = paginasIntroducao.find(p => p.id === pageId);
            conteudoDiv.innerHTML = page.render();
            currentPageId = pageId;

            // Adiciona listeners para os botões de navegação
            document.querySelectorAll('.botoes-navegacao button').forEach(button => {
                button.addEventListener('click', (event) => {
                    const targetPageId = event.target.dataset.target;
                    navigateToPage(targetPageId);
                });
            });

            // Adiciona listeners para os botões interativos que abrem popups de texto
            document.querySelectorAll('.botoes-interativos button').forEach(button => {
                button.addEventListener('click', (event) => {
                    const title = event.target.dataset.popupTitle;
                    const content = event.target.dataset.popupContent;
                    document.getElementById('textoPopupTitulo').textContent = title;
                    document.getElementById('textoPopupConteudo').innerHTML = content;
                    openPopup(textoPopup);
                });
            });

            // Executa a função onEnter se ela existir para a página
            if (page.onEnter) {
                page.onEnter();
            }
        }
        // Se não for uma página de introdução, tenta renderizar como página de aventura
        else if (aventuraData[pageId]) {
            renderizarPaginaAventura(pageId);
        } else {
            console.error(`Página não encontrada: ${pageId}`);
            conteudoDiv.innerHTML = `<h2>Erro</h2><p>A página "${pageId}" não foi encontrada. O jogo pode ter chegado ao fim ou há um erro na navegação.</p>`;
        }
    }

    // Função para renderizar páginas da aventura (carregadas do Aventura.json)
    function renderizarPaginaAventura(pageId) {
        const page = aventuraData[pageId];
        if (!page) {
            console.error(`Página de aventura não encontrada: ${pageId}`);
            conteudoDiv.innerHTML = `<h2>Erro</h2><p>A página de aventura "${pageId}" não foi encontrada.</p>`;
            return;
        }

        let htmlContent = `<h2>${page.titulo || 'Página da Aventura'}</h2>`;
        if (page.texto) {
            htmlContent += `<p>${page.texto}</p>`;
        }
        if (page.imagem) {
            htmlContent += `<img src="${page.imagem}" alt="${page.titulo || 'Imagem da Aventura'}">`;
        }

        if (page.opcoes && page.opcoes.length > 0) {
            htmlContent += '<div class="botoes-navegacao">';
            page.opcoes.forEach(opcao => {
                htmlContent += `<button data-target="${opcao.destino}">${opcao.texto}</button>`;
            });
            htmlContent += '</div>';
        } else {
            htmlContent += '<p>Fim da jornada.</p>';
        }
        conteudoDiv.innerHTML = htmlContent;
        currentPageId = pageId; // Atualiza a página atual

        // Adiciona listeners aos botões de navegação da página de aventura
        document.querySelectorAll('.botoes-navegacao button').forEach(button => {
            button.addEventListener('click', (event) => {
                const targetPageId = event.target.dataset.target;
                navigateToPage(targetPageId);
            });
        });
    }

    // Carrega o arquivo JSON da aventura no início
    fetch('Aventura.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            aventuraData = data;
            navigateToPage(currentPageId); // Inicia o jogo na página da capa
            carregarFicha(); // Carrega a ficha do jogador (se houver)
        })
        .catch(error => {
            console.error('Erro ao carregar Aventura.json:', error);
            conteudoDiv.innerHTML = `<h2>Erro</h2><p>Não foi possível carregar os dados da aventura. Por favor, verifique se o arquivo 'Aventura.json' existe e está formatado corretamente. Detalhes do erro: ${error.message}</p>`;
        });

    // Event listeners para os botões fixos do rodapé
    btnStatus.addEventListener('click', () => {
        renderizarFichaNoPopup(); // Garante que a ficha está atualizada no popup
        openPopup(statusPopup);
    });
    btnDados.addEventListener('click', () => openPopup(dadosPopup));

    btnSalvarJogo.addEventListener('click', () => {
        const gameState = {
            jogador: jogador,
            currentPageId: currentPageId
        };
        localStorage.setItem('gameState', JSON.stringify(gameState));
        alert('Jogo salvo com sucesso!');
        console.log("Jogo salvo:", gameState);
    });

    btnCarregarJogo.addEventListener('click', () => {
        const savedGameState = localStorage.getItem('gameState');
        if (savedGameState) {
            const gameState = JSON.parse(savedGameState);
            jogador = gameState.jogador;
            currentPageId = gameState.currentPageId;
            navigateToPage(currentPageId);
            carregarFicha(); // Recarrega a ficha e atualiza o display
            // Garante que a barra de status e botões fixos estejam visíveis se o jogo já começou
            if (paginasIntroducao.findIndex(p => p.id === currentPageId) >= paginasIntroducao.findIndex(p => p.id === 'equipamentos')) {
                    barraStatus.classList.remove('hidden');
                    botoesFixos.classList.remove('hidden');
            }
            alert('Jogo carregado com sucesso!');
            console.log("Jogo carregado:", gameState);
        } else {
            alert('Nenhum jogo salvo encontrado.');
            console.log("Nenhum jogo salvo para carregar.");
        }
    });

    // Chama a função para atualizar o display de status inicial ao carregar a página
    atualizarDisplayStatus();
});