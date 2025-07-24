document.addEventListener('DOMContentLoaded', () => {
    const conteudoDiv = document.getElementById('conteudo');
    const barraStatus = document.getElementById('barraStatus');
    const botoesFixos = document.getElementById('botoesFixos');

    // Popups
    const statusPopup = document.getElementById('statusPopup');
    const dadosPopup = document.getElementById('dadosPopup');
    const textoPopup = document.getElementById('textoPopup');

    // NOVO: Elementos para Popups Personalizados (Alert, Confirm, Password Prompt)
    const customAlertDialog = document.getElementById('customAlertDialog');
    const customAlertTitle = document.getElementById('customAlertTitle');
    const customAlertMessage = document.getElementById('customAlertMessage');
    const customAlertOkBtn = document.getElementById('customAlertOkBtn');

    const customConfirmDialog = document.getElementById('customConfirmDialog');
    const customConfirmTitle = document.getElementById('customConfirmTitle');
    const customConfirmMessage = document.getElementById('customConfirmMessage');
    const customConfirmYesBtn = document.getElementById('customConfirmYesBtn');
    const customConfirmNoBtn = document.getElementById('customConfirmNoBtn');

    const passwordPromptDialog = document.getElementById('passwordPromptDialog');
    const passwordInput = document.getElementById('passwordInput');
    const passwordSubmitBtn = document.getElementById('passwordSubmitBtn');
    const passwordCancelBtn = document.getElementById('passwordCancelBtn');


    // Status Popup Elements - Atributos
    const inputHabilidade = document.getElementById('inputHabilidade');
    const ajusteHabilidade = document.getElementById('ajusteHabilidade');
    const inputEnergia = document.getElementById('inputEnergia');
    const ajusteEnergia = document.getElementById('ajusteEnergia');
    const inputSorte = document.getElementById('inputSorte');
    const ajusteSorte = document.getElementById('ajusteSorte');
    const inputOuro = document.getElementById('inputOuro');
    const ajusteOuro = document.getElementById('ajusteOuro');
    const inputMagia = document.getElementById('inputMagia');
    const ajusteMagia = document.getElementById('ajusteMagia');

    // Status Popup Elements - Inventário
    const listaEncantos = document.getElementById('listaEncantos');
    const selectEncanto = document.getElementById('selectEncanto');
    const inputEncantoQuantidade = document.getElementById('inputEncantoQuantidade'); 
    const addEncantoBtn = document.getElementById('addEncanto');

    const listaEquipamentos = document.getElementById('listaEquipamentos');
    const inputEquipamento = document.getElementById('inputEquipamento');
    const addEquipamentoBtn = document.getElementById('addEquipamento');

    // Fixed Buttons (Rodapé)
    const btnStatus = document.getElementById('btnStatus');
    const btnDados = document.getElementById('btnDados');
    const btnSalvarJogo = document.getElementById('btnSalvarJogo');
    const btnCarregarJogo = document.getElementById('btnCarregarJogo');
    const btnRegras = document.getElementById('btnRegras'); // NOVO: Botão Regras

    // Display for fixed status bar
    const displayHabilidade = document.getElementById('displayHabilidade');
    const displayEnergia = document.getElementById('displayEnergia');
    const displaySorte = document.getElementById('displaySorte');
    const displayOuro = document.getElementById('displayOuro');
    const displayMagia = document.getElementById('displayMagia');

    let aventuraData = {};
    let jogador = {
        habilidadeInicial: null,
        energiaInicial: null,
        sorteInicial: null,
        ouroInicial: null,
        magiaInicial: null,
        habilidadeAtual: 0,
        energiaAtual: 0,
        sorteAtual: 0,
        ouroAtual: 0,
        magiaAtual: 0,
        encantos: [],
        equipamentos: []
    };

    const encantosDisponiveisNomes = [
        "Cópia de Criatura", "Percepção Extra-Sensorial", "Fogo",
        "Ouro dos Tolos", "Ilusão", "Levitação",
        "Sorte (Recuperação)", "Escudo", "Habilidade (Recuperação)",
        "Energia (Recuperação)", "Força", "Fraqueza"
    ];

    // --- FUNÇÕES DE POPUP PERSONALIZADAS ---
    // Substitui alert()
    function customAlert(message, title = 'Aviso') {
        return new Promise(resolve => {
            customAlertTitle.textContent = title;
            customAlertMessage.textContent = message;
            customAlertDialog.classList.remove('hidden');
            const handleOk = () => {
                customAlertDialog.classList.add('hidden');
                customAlertOkBtn.removeEventListener('click', handleOk);
                resolve();
            };
            customAlertOkBtn.addEventListener('click', handleOk);
        });
    }

    // Substitui confirm()
    function customConfirm(message, title = 'Confirmação') {
        return new Promise(resolve => {
            customConfirmTitle.textContent = title;
            customConfirmMessage.textContent = message;
            customConfirmDialog.classList.remove('hidden');

            const handleYes = () => {
                customConfirmDialog.classList.add('hidden');
                customConfirmYesBtn.removeEventListener('click', handleYes);
                customConfirmNoBtn.removeEventListener('click', handleNo);
                resolve(true);
            };
            const handleNo = () => {
                customConfirmDialog.classList.add('hidden');
                customConfirmYesBtn.removeEventListener('click', handleYes);
                customConfirmNoBtn.removeEventListener('click', handleNo);
                resolve(false);
            };

            customConfirmYesBtn.addEventListener('click', handleYes);
            customConfirmNoBtn.addEventListener('click', handleNo);
        });
    }

    // Substitui prompt() para senhas (usado na página 229)
    function customPasswordPrompt(message = 'Digite a senha:') {
        return new Promise(resolve => {
            passwordPromptDialog.querySelector('p').textContent = message;
            passwordInput.value = ''; // Limpa o input
            passwordPromptDialog.classList.remove('hidden');

            const handleSubmit = () => {
                passwordPromptDialog.classList.add('hidden');
                passwordSubmitBtn.removeEventListener('click', handleSubmit);
                passwordCancelBtn.removeEventListener('click', handleCancel);
                resolve(passwordInput.value);
            };
            const handleCancel = () => {
                passwordPromptDialog.classList.add('hidden');
                passwordSubmitBtn.removeEventListener('click', handleSubmit);
                passwordCancelBtn.removeEventListener('click', handleCancel);
                resolve(null); // Retorna null se o usuário cancelar
            };

            passwordSubmitBtn.addEventListener('click', handleSubmit);
            passwordCancelBtn.addEventListener('click', handleCancel);
            passwordInput.focus(); // Foca no input para digitação imediata
        });
    }


    // --- Popup Management (mantido com as personalizações) ---
    function openPopup(popupElement) {
        popupElement.classList.remove('hidden');
        if (popupElement === statusPopup) {
            setupResetButtonListener(); 
            populateEncantoDropdown();
        } else if (popupElement === dadosPopup) {
            document.getElementById('dado1').textContent = '?';
            document.getElementById('dado2').textContent = '?';
            document.getElementById('resultadoDados').textContent = '';
        }
    }

    function closePopup(popupElement) {
        popupElement.classList.add('hidden');
    }

    document.querySelectorAll('.popup-overlay').forEach(overlay => {
        overlay.addEventListener('click', (event) => {
            // Garante que o clique fora do conteúdo feche o popup,
            // exceto para os novos popups personalizados que têm seus próprios botões OK/Sim/Não/Confirmar/Cancelar.
            if (event.target === overlay && ![customAlertDialog, customConfirmDialog, passwordPromptDialog].includes(overlay)) {
                if (overlay === statusPopup) {
                    carregarFicha();
                }
                closePopup(overlay);
            }
        });
    });

    document.getElementById('btnFecharStatus').addEventListener('click', () => {
        carregarFicha();
        closePopup(statusPopup);
    });
    document.getElementById('btnFecharDados').addEventListener('click', () => closePopup(dadosPopup));
    document.getElementById('btnFecharTextoPopup').addEventListener('click', () => closePopup(textoPopup));

    // --- Player State Management ---
    function salvarFicha() {
        if (inputHabilidade.value !== '' && jogador.habilidadeInicial === null) jogador.habilidadeInicial = parseInt(inputHabilidade.value);
        if (inputEnergia.value !== '' && jogador.energiaInicial === null) jogador.energiaInicial = parseInt(inputEnergia.value);
        if (inputSorte.value !== '' && jogador.sorteInicial === null) jogador.sorteInicial = parseInt(inputSorte.value);
        if (inputOuro.value !== '' && jogador.ouroInicial === null) jogador.ouroInicial = parseInt(inputOuro.value);
        if (inputMagia.value !== '' && jogador.magiaInicial === null) jogador.magiaInicial = parseInt(inputMagia.value); 

        jogador.habilidadeAtual = parseInt(ajusteHabilidade.value) || 0;
        jogador.energiaAtual = parseInt(ajusteEnergia.value) || 0;
        jogador.sorteAtual = parseInt(ajusteSorte.value) || 0;
        jogador.ouroAtual = parseInt(ajusteOuro.value) || 0;
        jogador.magiaAtual = parseInt(ajusteMagia.value) || 0; 

        localStorage.setItem('jogador', JSON.stringify(jogador));
        atualizarDisplayStatus();
        console.log("Ficha salva automaticamente:", jogador);
    }

    function carregarFicha() {
        const savedJogador = localStorage.getItem('jogador');
        if (savedJogador) {
            jogador = JSON.parse(savedJogador);
            if (!jogador.encantos) jogador.encantos = [];
            if (!jogador.equipamentos) jogador.equipamentos = [];
            console.log("Ficha carregada:", jogador);
        } else {
            console.log("Nenhuma ficha salva encontrada, resetando estado.");
            resetarFichaEstado();
        }
        renderizarFichaNoPopup();
        atualizarDisplayStatus();
    }

    function resetarFichaEstado() {
        const equipamentosBaseFixos = [
            { nome: 'Espada' },
            { nome: 'Armadura de Couro' },
            { nome: 'Lanterna' },
            { nome: 'Mochila' }
        ];

        jogador = {
            habilidadeInicial: null,
            energiaInicial: null,
            sorteInicial: null,
            ouroInicial: null,
            magiaInicial: null, 
            habilidadeAtual: 0,
            energiaAtual: 0,
            sorteAtual: 0,
            ouroAtual: 0,
            magiaAtual: 0, 
            encantos: [],
            equipamentos: [...equipamentosBaseFixos]
        };
        localStorage.removeItem('jogador');
        console.log("Estado da ficha resetado e localStorage limpo.");
    }

    function renderizarFichaNoPopup() {
        const attributes = ['habilidade', 'energia', 'sorte', 'ouro', 'magia'];
        attributes.forEach(attr => {
            const inputInitial = document.getElementById(`input${attr.charAt(0).toUpperCase() + attr.slice(1)}`);
            const btnFixar = document.querySelector(`.btn-fixar[data-attr="${attr}"]`);
            const initialValue = jogador[`${attr}Inicial`];

            if (inputInitial && btnFixar) {
                if (initialValue !== null) {
                    inputInitial.value = initialValue;
                    inputInitial.disabled = true;
                    btnFixar.disabled = true;
                    btnFixar.style.backgroundColor = '#666';
                } else {
                    inputInitial.value = '';
                    inputInitial.disabled = false;
                    btnFixar.disabled = false;
                    btnFixar.style.backgroundColor = '';
                }
            }

            const ajusteCurrent = document.getElementById(`ajuste${attr.charAt(0).toUpperCase() + attr.slice(1)}`);
            if (ajusteCurrent) {
                ajusteCurrent.value = jogador[`${attr}Atual`];
            }
        });

        populateEncantoDropdown();
        renderizarItens(listaEncantos, jogador.encantos, true, 'encanto'); 
        renderizarItens(listaEquipamentos, jogador.equipamentos, true, 'equipamento');
    }

    function renderizarItens(listElement, items, removable, type = '') {
        listElement.innerHTML = '';
        items.forEach((itemObj, index) => {
            const li = document.createElement('li');
            li.classList.add('item-lista');

            if (type === 'encanto') {
                li.innerHTML = `
                    <span class="item-nome" data-nome="${itemObj.nome}">${itemObj.nome}</span>
                    <div class="item-quantidade-controle">
                        <button class="btn-ajuste-item" data-action="minus" data-index="${index}" data-type="${type}">-</button>
                        <span class="item-quantidade">${itemObj.quantidade}</span>
                        <button class="btn-ajuste-item" data-action="plus" data-index="${index}" data-type="${type}">+</button>
                    </div>
                `;
                li.querySelector('.item-nome').addEventListener('click', (event) => {
                    const encantoNome = event.target.dataset.nome;
                    const encantosPageHtmlString = paginasIntroducao.find(p => p.id === 'encantos').render();
                    const tempDiv = document.createElement('div');
                    tempDiv.innerHTML = encantosPageHtmlString;
                    const targetButton = tempDiv.querySelector(`button[data-popup-title="${encantoNome}"]`);
                    
                    if (targetButton && targetButton.dataset.popupContent) {
                        document.getElementById('textoPopupTitulo').textContent = encantoNome;
                        document.getElementById('textoPopupConteudo').innerHTML = targetButton.dataset.popupContent;
                        openPopup(textoPopup);
                    } else {
                        console.warn(`Descrição para encanto '${encantoNome}' não encontrada. Verifique se o nome no encantosDisponiveisNomes corresponde ao data-popup-title na página 'encantos'.`);
                    }
                });

            } else {
                li.textContent = itemObj.nome;
            }

            if (removable) {
                const removeBtn = document.createElement('button');
                removeBtn.textContent = '✖';
                removeBtn.classList.add('remover-item');
                removeBtn.addEventListener('click', (event) => {
                    event.stopPropagation();
                    items.splice(index, 1);
                    salvarFicha();
                    renderizarItens(listElement, items, removable, type);
                });
                li.appendChild(removeBtn);
            }
            listElement.appendChild(li);
        });

        if (type === 'encanto') {
            document.querySelectorAll('.btn-ajuste-item').forEach(button => {
                button.addEventListener('click', (event) => {
                    const index = parseInt(event.target.dataset.index);
                    const action = event.target.dataset.action;
                    let encanto = items[index];

                    if (encanto) {
                        if (action === 'plus') {
                            encanto.quantidade++;
                        } else if (action === 'minus') {
                            encanto.quantidade--;
                            if (encanto.quantidade < 0) encanto.quantidade = 0;
                        }

                        if (encanto.quantidade === 0) {
                            items.splice(index, 1);
                        }
                        salvarFicha();
                        renderizarItens(listElement, items, removable, type);
                    }
                });
            });
        }
    }

    function atualizarDisplayStatus() {
        displayHabilidade.textContent = jogador.habilidadeAtual;
        displayEnergia.textContent = jogador.energiaAtual;
        displaySorte.textContent = jogador.sorteAtual;
        displayOuro.textContent = jogador.ouroAtual;
        displayMagia.textContent = jogador.magiaAtual;
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
                event.target.style.backgroundColor = '#666';
                salvarFicha();
            } else {
                customAlert(`Por favor, insira um valor numérico para ${attr}.`); // USANDO CUSTOM ALERT
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

    document.querySelectorAll('.ajuste-atual').forEach(input => {
        input.addEventListener('change', (event) => {
            const attr = event.target.id.replace('ajuste', '').toLowerCase();
            const value = parseInt(event.target.value);
            if (!isNaN(value)) {
                jogador[`${attr}Atual`] = value;
                salvarFicha();
            } else {
                event.target.value = jogador[`${attr}Atual`];
            }
        });
    });

    function populateEncantoDropdown() {
        if (selectEncanto) {
            selectEncanto.innerHTML = '<option value="">Selecione um Encanto</option>';
            encantosDisponiveisNomes.forEach(encantoNome => {
                const option = document.createElement('option');
                option.value = encantoNome;
                option.textContent = encantoNome;
                selectEncanto.appendChild(option);
            });
        }
    }

    function addItem(inputElement, itemArray, listElement, removable, quantityElement = null, type = '') {
        const itemNome = inputElement.value.trim();
        let quantity = quantityElement ? parseInt(quantityElement.value) || 1 : 1;

        if (itemNome) {
            if (type === 'encanto') {
                const existingItemIndex = itemArray.findIndex(i => i.nome === itemNome);
                if (existingItemIndex !== -1) {
                    itemArray[existingItemIndex].quantidade += quantity;
                } else {
                    itemArray.push({ nome: itemNome, quantidade: quantity });
                }
            } else { // Para equipamentos
                const existingItemIndex = itemArray.findIndex(i => i.nome === itemNome);
                if (existingItemIndex === -1) {
                    itemArray.push({ nome: itemNome });
                } else {
                    customAlert(`Você já possui ${itemNome} em seu inventário.`); // USANDO CUSTOM ALERT
                }
            }
            inputElement.value = '';
            if (quantityElement) quantityElement.value = 1;
            salvarFicha();
            renderizarItens(listElement, itemArray, removable, type);
        }
    }

    if (selectEncanto && inputEncantoQuantidade && addEncantoBtn) {
        addEncantoBtn.addEventListener('click', () => {
            const selectedEncanto = selectEncanto.value;
            if (selectedEncanto) {
                addItem(selectEncanto, jogador.encantos, listaEncantos, true, inputEncantoQuantidade, 'encanto');
                selectEncanto.value = '';
            } else {
                customAlert('Por favor, selecione um encanto da lista.'); // USANDO CUSTOM ALERT
            }
        });
    }
    
    addEquipamentoBtn.addEventListener('click', () => { addItem(inputEquipamento, jogador.equipamentos, listaEquipamentos, true, null, 'equipamento'); });

    // --- FUNÇÃO PARA CONFIGURAR O LISTENER DO BOTÃO RESETAR FICHA ---
    function setupResetButtonListener() {
        const btnResetarFicha = document.getElementById('btnResetarFicha');
        if (btnResetarFicha) {
            btnResetarFicha.removeEventListener('click', handleResetClick);
            btnResetarFicha.addEventListener('click', handleResetClick);
            console.log('Listener para btnResetarFicha ANEXADO na abertura do popup.');
        } else {
            console.warn('AVISO: btnResetarFicha não encontrado no DOM ao tentar configurar o listener. Verifique o HTML.');
        }
    }

    async function handleResetClick() { // Adicionado 'async'
        console.log('handleResetClick() invocado!');
        // USANDO CUSTOM CONFIRM
        const confirmed = await customConfirm('Tem certeza que deseja resetar a ficha? Isso apagará todos os dados salvos.');
        if (confirmed) {
            console.log('Confirmação de reset: SIM.');
            resetarFichaEstado();
            renderizarFichaNoPopup();
            atualizarDisplayStatus();
            await customAlert('Ficha resetada!'); // USANDO CUSTOM ALERT
        } else {
            console.log('Confirmação de reset: CANCELADA.');
        }
    }

    // --- FUNÇÕES DE ROLAGEM DE DADOS ---
    document.querySelectorAll('.dados-popup-content button[data-num-dados]').forEach(button => {
        button.addEventListener('click', (event) => {
            const numDados = parseInt(event.target.dataset.numDados);
            const dado1 = document.getElementById('dado1');
            const dado2 = document.getElementById('dado2');
            const resultadoDados = document.getElementById('resultadoDados');

            dado1.classList.add('rolando');
            dado2.classList.add('rolando');
            resultadoDados.textContent = '';

            setTimeout(() => {
                const val1 = Math.floor(Math.random() * 6) + 1;
                let total = val1;
                dado1.textContent = val1;
                dado2.textContent = '?';

                if (numDados === 2) {
                    const val2 = Math.floor(Math.random() * 6) + 1;
                    total += val2;
                    dado2.textContent = val2;
                } else {
                    dado2.textContent = '';
                }

                resultadoDados.textContent = `Soma: ${total}`;

                dado1.classList.remove('rolando');
                dado2.classList.remove('rolando');
            }, 1000);
        });
    });

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
                    <button data-popup-title="Sorte" data-popup-content="O seu índice de <strong>SORTE</strong> indica o quanto você é uma pessoa naturalmente de sorte. Sorte — e magia — são fatos da vida no reino da fantasia que você está prestes a explorar. Para determinar sua SORTE inicial, jogue um dado, somar seis a este número e registre o total na sua Ficha de Status. Os índices de SORTE mudam constantemente durante uma aventura, e você deve fazer um registro preciso. Nunca apague seu índice Inicial. Embora você possa conquistar pontos adicionais de SORTE, este total nunca poderá exceder seu índice Inicial, a não ser em raríssimas ocasiões, quando haverá instruções específicas. Em diversos momentos da sua aventura, tanto durante as batalhas quanto nas situações em que você pode ter ou não sorte, você pode apelar para a sua sorte para tornar o resultado mais favorável. Mas tome cuidado! Usar a sorte é um negócio arriscado e, se você não tiver sorte, os resultados podem ser desastrosos. O procedimento para usar à sua sorte é o seguinte: jogue dois dados. Se o número obtido for igual ou menor do que o seu índice de SORTE atual, você teve sorte, e o resultado será a seu favor. Se o número obtido for maior do que o seu índice de SORTE atual, você não teve sorte e sofrerá as consequências. Este procedimento é conhecido como Testar a sua Sorte. Cada vez que você Testar a sua Sorte, terá que subtrair um ponto do seu índice de SORTE atual. Portanto, você logo compreenderá que quanto mais confiar na sua sorte, mais arriscado isso se tornará.">Sorte</button>
                    <button data-popup-title="Batalhas" data-popup-content="Frequentemente você encontrará páginas que o instruirão para que lute contra algum tipo de criatura. Talvez haja a alternativa de fugir ou usar um encanto mágico, mas se não houver — ou se você decidir atacar a criatura de qualquer maneira – você terá que resolver a batalha conforme descrito abaixo. A sequência de combate é a seguinte: 1. Jogue os dois dados uma vez para a criatura. Some a seu índice de HABILIDADE. Este total é a Força de Ataque da criatura. 2. Jogue ambos os dados uma vez para você. Some o número obtido a seu índice atual de HABILIDADE. Este total é sua Força de Ataque. 3. Se sua Força de Ataque for maior do que a da criatura, você a feriu. Se a Força de Ataque da criatura for maior do que a sua, ela feriu você. Se os dois totais de Força de Ataque forem iguais, vocês se defenderam dos golpes – comece a próxima Série de Ataque a partir do item 1. 4. Se você tiver ferido a criatura, subtraia 2 pontos de seu índice de ENERGIA. Você pode usar sua SORTE aqui para causar maiores danos (ver na seção Sorte). 5. Se a criatura tiver ferido você, subtraia 2 pontos de seu próprio índice de ENERGIA. Também neste momento você pode usar a sua SORTE (ver na seção Sorte). 6. Faça os ajustes apropriados nos índices de ENERGIA, seu ou da criatura (e em seu índice de SORTE, se você tiver usado a SORTE - ver na seção Sorte). 7. Comece a próxima Série de Ataque retornando a seu índice de HABILIDADE atual, e depois repita os itens de 1 a 6. Esta sequência continua até que o índice de ENERGIA seu ou da criatura contra quem você está lutando tenha sido reduzido a zero (morte).">Batalhas</button>
                    <button data-popup-title="Testar Sorte em Batalhas" data-popup-content="Em batalhas, você sempre terá a opção de Testar sua Sorte. Se tiver acabado de ferir uma criatura e tiver Sorte (jogue 2 dados, se o resultado for igual ou menor que sua SORTE atual), você causará um ferimento mais grave, subtraindo 2 pontos extras de ENERGIA da criatura. Se não tiver Sorte, o ferimento será leve, e você devolve 1 ponto de ENERGIA à criatura. Se a criatura feriu você e tiver Sorte, você recupera 1 ponto de ENERGIA. Se não tiver Sorte, você sofre 1 ponto extra de ENERGIA. Lembre-se: subtraia 1 ponto da sua SORTE a cada vez que Testar sua Sorte.">Testar Sorte em Batalhas</button>
                    <button data-popup-title="Luta Contra Múltiplas Criaturas" data-popup-content="Se você enfrentar mais de uma criatura em um encontro, as instruções na página da aventura dirão como lidar com a batalha. Às vezes você as tratarão como um único monstro; às vezes lutará contra uma de cada vez.">Múltiplas Criaturas</button>
                    <button data-popup-title="Fuga" data-popup-content="Em algumas situações, pode ser dada a você a alternativa de fugir de uma batalha. Se você realmente escapar, sofrerá automaticamente um ferimento causado pela criatura (subtraia 2 pontos de ENERGIA) na sua fuga. Você pode usar a SORTE neste ferimento do modo normal (ver na seção Sorte). Você só pode Fugir se esta opção for especificamente dada no jogo.">Fuga</button>
                </div>
                <div class="botoes-navegacao">
                    <button data-target="recuperacao">Avançar</button>
                    <button data-target="introducao">Voltar</button>
                </div>
            `,
            onEnter: () => {
                barraStatus.classList.remove('hidden');
                botoesFixos.classList.remove('hidden');
                salvarFicha(); 
            }
        },
        {
            id: 'recuperacao',
            render: () => `
                <h2>Recuperação de Atributos</h2>
                <p>Durante sua jornada na Cidadela do Caos, seus atributos de Habilidade, Energia e Sorte podem variar. Saiba como recuperá-los e mantê-los em forma para os desafios à frente:</p>
                <div class="botoes-interativos">
                    <button data-popup-title="Recuperar Habilidade" data-popup-content="Seu índice de <strong>HABILIDADE</strong> raramente muda. Ocasionalmente, páginas específicas podem instruir um aumento ou diminuição. Armas Mágicas podem aumentá-la, mas apenas uma por vez. Lembre-se: sua HABILIDADE atual nunca pode exceder seu valor Inicial, a menos que haja uma instrução específica. A única forma de recuperar HABILIDADE perdida é utilizando um Encanto da Habilidade (veja a seção 'Encantos').">Habilidade</button>
                    <button data-popup-title="Recuperar Energia" data-popup-content="Seu índice de <strong>ENERGIA</strong> mudará frequentemente em combate. Para recuperá-la, você pode usar um Encanto da Energia (veja a seção 'Encantos'). É prudente incluir diversos Encantos da Energia em sua escolha inicial. Lembre-se: sua ENERGIA atual nunca pode ultrapassar seu valor Inicial, a menos que haja uma instrução específica.">Energia</button>
                    <button data-popup-title="Recuperar Sorte" data-popup-content="Seu índice de <strong>SORTE</strong> pode ser restaurado em momentos de sorte especial, conforme detalhado nas páginas da aventura. Assim como os outros atributos, sua SORTE atual nunca pode ultrapassar seu valor Inicial, a menos que haja uma instrução específica. A única outra maneira de recuperar SORTE perdida é usando um Encanto da Sorte (veja a seção 'Encantos').">Sorte</button>
                </div>
                <div class="botoes-navegacao">
                    <button data-target="usoDeMagia">Avançar</button>
                    <button data-target="comoLutar">Voltar</button>
                </div>
            `
        },
        {
            id: 'usoDeMagia',
            render: () => `
                <h2>O USO DA MAGIA</h2>
                <p>Além de Habilidade, Energia e Sorte, você possui um índice de <strong>MAGIA</strong> que determina quantos Encantos Mágicos você pode utilizar em sua jornada.</p>
                <div class="botoes-interativos">
                    <button data-popup-title="Seu Índice de Magia" data-popup-content="Para determinar seu índice de <strong>MAGIA</strong> inicial, jogue dois dados e somar seis ao resultado. Este total indica a quantidade de encantos que você pode escolher e usar durante a aventura. Você pode selecionar seus encantos da lista disponível na seção 'Encantos' da sua Ficha de Status.">Índice de Magia</button>
                    <button data-popup-title="Utilizando Encantos" data-popup-content="Cada vez que você usar um encanto, ele será deduzido da sua lista de Encantos na Ficha de Status. Se você possuir mais de uma unidade de um encanto, o restante será reduzido em um. Fique atento para não tentar usar encantos que você não possui ou que já se esgotaram, pois essas opções não estarão disponíveis nas páginas da aventura.">Utilizando Encantos</button>
                </div>
                <p>Mesmo com um índice de Magia baixo, com escolhas sábias e um pouco de sorte, você terá encantos suficientes para completar sua empreitada!</p>
                <div class="botoes-navegacao">
                    <button data-target="encantos">Avançar</button>
                    <button data-target="recuperacao">Voltar</button>
                </div>
            `
        },
        {
            id: 'encantos',
            render: () => `
                <h2>Encantos</h2>
                <p>Os encantos são magias que você pode aprender e usar. Cada um tem um efeito único e consome uma unidade de seu uso ao ser ativado. Escolha sabiamente quais levará em sua aventura!</p>
                <div class="botoes-interativos">
                    <button data-popup-title="Cópia de Criatura" data-popup-content="Cria uma réplica perfeita de qualquer criatura em combate. A réplica terá os mesmos índices de Habilidade e Energia e os mesmos poderes do original, mas estará sob seu controle para atacar a criatura original.">Cópia de Criatura</button>
                    <button data-popup-title="Percepção Extra-Sensorial" data-popup-content="Permite sintonizar comprimentos de ondas psíquicas para ler mentes ou descobrir o que está por trás de portas trancadas. Pode dar informações equivocadas se houver múltiplas fontes psíquicas próximas.">Percepção Extra-Sensorial</button>
                    <button data-popup-title="Fogo" data-popup-content="Cria fogo à sua vontade, seja uma pequena explosão ou uma barreira para manter criaturas à distância. Todas as criaturas temem o fogo.">Fogo</button>
                    <button data-popup-title="Ouro dos Tolos" data-popup-content="Transforma pedra comum em uma pilha do que parece ser ouro. É uma ilusão que logo voltará a ser pedra.">Ouro dos Tolos</button>
                    <button data-popup-title="Ilusão" data-popup-content="Cria uma ilusão convincente para enganar uma criatura (ex: transformar-se em serpente). Desfeito se a ilusão for quebrada. Mais eficiente com criaturas inteligentes.">Ilusão</button>
                    <button data-popup-title="Levitação" data-popup-content="Pode ser lançado sobre objetos, adversários ou sobre você mesmo, liberando-os dos efeitos da gravidade e fazendo-os flutuar sob seu controle.">Levitação</button>
                    <button data-popup-title="Sorte (Recuperação)" data-popup-content="Pode ser usado a qualquer momento, exceto em batalha. Recupera seu índice de <strong>SORTE</strong> em metade de seu valor Inicial (arredondando para baixo). Não pode exceder seu valor Inicial.">Sorte (Recuperação)</button>
                    <button data-popup-title="Escudo" data-popup-content="Cria um escudo invisível à sua frente que o protegerá de objetos físicos (flechas, espadas, criaturas). Não tem efeito contra magia. Impede contato com o exterior.">Escudo</button>
                    <button data-popup-title="Habilidade (Recuperação)" data-popup-content="Pode ser usado a qualquer momento, exceto em batalha. Restabelece seu índice de <strong>HABILIDADE</strong>, aumentando-o em metade de seu valor Inicial (arredondando para baixo). Não pode exceder seu valor Inicial.">Habilidade (Recuperação)</button>
                    <button data-popup-title="Energia (Recuperação)" data-popup-content="Pode ser usado a qualquer momento. Recupera seu índice de <strong>ENERGIA</strong>, aumentando-o em metade de seu valor Inicial (arredondando para baixo). Não pode exceder seu valor Inicial.">Energia (Recuperação)</button>
                    <button data-popup-title="Força" data-popup-content="Aumenta muito a sua força, útil em lutas contra criaturas fortes. Deve ser usado com cautela, pois é difícil controlar força excessiva.">Força</button>
                    <button data-popup-title="Fraqueza" data-popup-content="Reduz criaturas fortes a miseráveis fracotes. Não tem efeito contra todas as criaturas, mas, quando tem, a criatura se torna mais frágil e menos perigosa em batalha.">Fraqueza</button>
                </div>
                <div class="botoes-navegacao">
                    <button data-target="equipamentos">Avançar</button>
                    <button data-target="usoDeMagia">Voltar</button>
                </div>
            `
        },
        {
            id: 'equipamentos',
            render: () => `
                <h2>Equipamentos</h2>
                <p>Você inicia sua jornada com o equipamento essencial: uma <strong>espada</strong> para combate, uma <strong>armadura de couro</strong> para proteção, uma <strong>lanterna</strong> para iluminar seu caminho e uma <strong>mochila</strong> para guardar os tesouros que encontrar.</p>
                <p>À medida que avançar, registre todos os itens que adquirir na seção 'Equipamentos' da sua Ficha de Status. Durante a aventura, a história indicará quando um item deve ser descartado ou destruído; se isso acontecer, remova-o da sua lista, pois não poderá mais ser usado.</p>
                <p><strong>Neste ponto, sua ficha de status e os botões fixos estarão visíveis. Preencha sua ficha para começar a aventura!</strong></p>
                <div class="botoes-navegacao">
                    <button data-target="historia_intro">Entrar na Cidadela</button>
                    <button data-target="encantos">Voltar</button>
                </div>
            `,
            onEnter: () => {
                barraStatus.classList.remove('hidden');
                botoesFixos.classList.remove('hidden');
                
                const equipamentosBaseFixos = [
                    { nome: 'Espada' },
                    { nome: 'Armadura de Couro' },
                    { nome: 'Lanterna' },
                    { nome: 'Mochila' }
                ];

                equipamentosBaseFixos.forEach(itemFixo => {
                    const existe = jogador.equipamentos.some(itemExistente => itemExistente.nome === itemFixo.nome);
                    if (!existe) {
                        jogador.equipamentos.push(itemFixo);
                    }
                });

                salvarFicha();
                renderizarFichaNoPopup();
            }
        }
    ];

    let currentPageId = 'capa';

    function navigateToPage(pageId) {
        // Lógica para o prompt de número de página
        if (pageId === "prompt_page_number") {
            customPasswordPrompt("Você conhece a combinação! Digite o número da página para onde deseja ir:")
                .then(pageNum => {
                    if (pageNum !== null) { // Se o usuário não cancelou
                        pageNum = parseInt(pageNum);
                        if (pageNum === 217) { // Senha correta para a página 217
                            navigateToPage(`pag_217`);
                        } else if (!isNaN(pageNum) && pageNum > 0) {
                            customAlert("Senha incorreta. Tente novamente ou siga outra alternativa."); // Senha incorreta
                            // Opcional: navegar de volta para a página 229 ou manter o popup de senha
                            // Para manter na página atual (229) após o erro, não fazemos nada aqui além do alert.
                            // Para ir para a 229 novamente, seria navigateToPage('pag_229');
                        } else {
                            customAlert("Entrada inválida. Por favor, digite um número válido.");
                        }
                    }
                    // Se o usuário cancelar (pageNum é null), não faz nada e fecha o prompt.
                });
            return; // Interrompe a navegação normal
        }

        if (paginasIntroducao.some(p => p.id === pageId)) {
            const page = paginasIntroducao.find(p => p.id === pageId);
            conteudoDiv.innerHTML = page.render();
            currentPageId = pageId;

            document.querySelectorAll('.botoes-navegacao button').forEach(button => {
                button.addEventListener('click', (event) => {
                    const targetPageId = event.target.dataset.target;
                    navigateToPage(targetPageId);
                });
            });

            document.querySelectorAll('.botoes-interativos button').forEach(button => {
                button.addEventListener('click', (event) => {
                    const title = event.target.dataset.popupTitle;
                    const content = event.target.dataset.popupContent;
                    document.getElementById('textoPopupTitulo').textContent = title;
                    document.getElementById('textoPopupConteudo').innerHTML = content;
                    openPopup(textoPopup);
                });
            });

            if (page.onEnter) {
                page.onEnter();
            }
        } else if (aventuraData[pageId]) {
            renderizarPaginaAventura(pageId);
        } else {
            console.error(`Página não encontrada: ${pageId}`);
            conteudoDiv.innerHTML = `<h2>Erro</h2><p>A página "${pageId}" não foi encontrada. O jogo pode ter chegado ao fim ou há um erro na navegação.</p>`;
            const botoesNavegacaoDiv = document.createElement('div');
            botoesNavegacaoDiv.classList.add('botoes-navegacao');
            const voltarBtn = document.createElement('button');
            voltarBtn.textContent = "Voltar ao Início";
            voltarBtn.dataset.target = "capa";
            botoesNavegacaoDiv.appendChild(voltarBtn);
            conteudoDiv.appendChild(botoesNavegacaoDiv);
            voltarBtn.addEventListener('click', (event) => {
                navigateToPage(event.target.dataset.target);
            });
        }
    }

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
        currentPageId = pageId;

        document.querySelectorAll('.botoes-navegacao button').forEach(button => {
            button.addEventListener('click', (event) => {
                const targetPageId = event.target.dataset.target;
                navigateToPage(targetPageId);
            });
        });
    }

    fetch('Aventura.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            aventuraData = data;
            navigateToPage(currentPageId);
            carregarFicha();
        })
        .catch(error => {
            console.error('Erro ao carregar Aventura.json:', error);
            conteudoDiv.innerHTML = `<h2>Erro Crítico</h2><p>Não foi possível carregar os dados da aventura principal. Por favor, verifique se o arquivo 'Aventura.json' existe e está formatado corretamente. Detalhes do erro: ${error.message}</p>`;
            const botoesNavegacaoDiv = document.createElement('div');
            botoesNavegacaoDiv.classList.add('botoes-navegacao');
            const voltarBtn = document.createElement('button');
            voltarBtn.textContent = "Voltar ao Início";
            voltarBtn.dataset.target = "capa";
            botoesNavegacaoDiv.appendChild(voltarBtn);
            conteudoDiv.appendChild(botoesNavegacaoDiv);
            voltarBtn.addEventListener('click', (event) => {
                navigateToPage(event.target.dataset.target);
            });
        });

    btnStatus.addEventListener('click', () => {
        renderizarFichaNoPopup();
        openPopup(statusPopup);
    });
    btnDados.addEventListener('click', () => openPopup(dadosPopup));

    // NOVO: Salvamento e Carregamento agora usam customAlert
    btnSalvarJogo.addEventListener('click', async () => {
        const gameState = {
            jogador: jogador,
            currentPageId: currentPageId
        };
        localStorage.setItem('gameState', JSON.stringify(gameState));
        await customAlert('Jogo salvo com sucesso!');
        console.log("Jogo salvo:", gameState);
    });

    btnCarregarJogo.addEventListener('click', async () => {
        const savedGameState = localStorage.getItem('gameState');
        if (savedGameState) {
            const gameState = JSON.parse(savedGameState);
            jogador = gameState.jogador;
            currentPageId = gameState.currentPageId;
            navigateToPage(currentPageId);
            carregarFicha();
            if (paginasIntroducao.findIndex(p => p.id === currentPageId) >= paginasIntroducao.findIndex(p => p.id === 'comoLutar')) {
                    barraStatus.classList.remove('hidden');
                    botoesFixos.classList.remove('hidden');
            }
            await customAlert('Jogo carregado com sucesso!');
            console.log("Jogo carregado:", gameState);
        } else {
            await customAlert('Nenhum jogo salvo encontrado.');
            console.log("Nenhum jogo salvo para carregar.");
        }
    });

    // NOVO: Lógica para o botão "Regras"
    btnRegras.addEventListener('click', async () => {
        const confirmed = await customConfirm('Você deseja voltar para a página de regras? Lembre-se de salvar seu progresso antes, pois isso pode reiniciar sua aventura.', 'Voltar para Regras?');
        if (confirmed) {
            navigateToPage('comoLutar'); // Redireciona para a primeira página de regras após a introdução
        }
        // Se 'Não', o popup fecha e o jogador permanece na página atual.
    });

    atualizarDisplayStatus();
    populateEncantoDropdown();
});
