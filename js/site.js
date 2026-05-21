function atualizarCabecalhoAoRolar() {
    const cabecalho = document.getElementById("cabecalho");

    if (!cabecalho) {
        return;
    }

    const rolouPagina = document.body.scrollTop > 50 || document.documentElement.scrollTop > 50;
    cabecalho.classList.toggle("scrolled", rolouPagina);
}

function configurarLinksDaPaginaAtual() {
    const linksCabecalho = document.querySelectorAll("#cabecalho a[href]");

    linksCabecalho.forEach(function(link) {
        link.addEventListener("click", function(evento) {
            const url = new URL(link.getAttribute("href"), window.location.href);
            const paginaAtual = window.location.pathname.split("/").pop() || "index.html";
            const paginaDoLink = url.pathname.split("/").pop() || "index.html";

            if (url.origin !== window.location.origin || paginaDoLink !== paginaAtual || url.hash) {
                return;
            }

            evento.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });
    });
}

function configurarMenuMobile() {
    const cabecalho = document.getElementById("cabecalho");
    const botaoMenu = document.querySelector(".botao-menu");
    const menu = document.querySelector("#cabecalho .menu");

    if (!cabecalho || !botaoMenu || !menu) {
        return;
    }

    const linksMenu = Array.from(menu.querySelectorAll("a"));

    function atualizarAcessibilidadeMenu(aberto) {
        const menuMobile = window.innerWidth <= 900;
        menu.setAttribute("aria-hidden", menuMobile && !aberto ? "true" : "false");

        linksMenu.forEach(function(link) {
            if (menuMobile && !aberto) {
                link.setAttribute("tabindex", "-1");
                return;
            }

            link.removeAttribute("tabindex");
        });
    }

    function definirMenuAberto(aberto) {
        cabecalho.classList.toggle("menu-aberto", aberto);
        document.body.classList.toggle("menu-aberto", aberto);
        botaoMenu.setAttribute("aria-expanded", aberto ? "true" : "false");
        botaoMenu.setAttribute("aria-label", aberto ? "Fechar menu" : "Abrir menu");
        atualizarAcessibilidadeMenu(aberto);

        if (!aberto && document.activeElement === botaoMenu) {
            botaoMenu.blur();
        }
    }

    botaoMenu.addEventListener("click", function() {
        definirMenuAberto(!cabecalho.classList.contains("menu-aberto"));
    });

    cabecalho.addEventListener("click", function(evento) {
        if (!cabecalho.classList.contains("menu-aberto")) {
            return;
        }

        if (evento.target === cabecalho) {
            definirMenuAberto(false);
        }
    });

    linksMenu.forEach(function(link) {
        link.addEventListener("click", function() {
            definirMenuAberto(false);
        });
    });

    document.addEventListener("keydown", function(evento) {
        if (evento.key === "Escape") {
            definirMenuAberto(false);
        }
    });

    window.addEventListener("resize", function() {
        if (window.innerWidth > 900) {
            definirMenuAberto(false);
            return;
        }

        atualizarAcessibilidadeMenu(cabecalho.classList.contains("menu-aberto"));
    });

    atualizarAcessibilidadeMenu(false);
}

function configurarFormularioWhatsApp() {
    const formulario = document.getElementById("whatsForm");

    if (!formulario) {
        return;
    }

    const mensagemCaptcha = document.getElementById("mensagemCaptcha");
    const campoSite = document.getElementById("site");
    const statusFormulario = document.getElementById("statusFormulario");
    const modalConfirmacao = document.getElementById("modalConfirmacao");
    const previewMensagem = document.getElementById("previewMensagem");
    const textoConfirmacao = document.getElementById("textoConfirmacao");
    const tituloConfirmacao = document.getElementById("tituloConfirmacao");
    const notaConfirmacao = document.getElementById("notaConfirmacao");
    const confirmarEnvio = document.getElementById("confirmarEnvio");
    const cancelarConfirmacao = document.getElementById("cancelarConfirmacao");
    const fecharConfirmacao = document.getElementById("fecharConfirmacao");
    const radiosAreaContato = formulario.querySelectorAll('input[name="areaContato"]');
    const radiosCanalGeral = formulario.querySelectorAll('input[name="canalGeral"]');
    const campoAssunto = document.getElementById("assunto");
    const campoMensagem = document.getElementById("mensagem");
    const campoCurriculo = document.getElementById("curriculo");
    const ajudaCurriculo = document.getElementById("ajudaCurriculo");
    const botaoEnviarContato = document.getElementById("botaoEnviarContato");
    const camposCondicionais = Array.from(formulario.querySelectorAll("[data-required-area]"));
    let urlAcaoPendente = "";
    let destinoAcaoPendente = "";
    let dadosEmailPendentes = null;
    function obterMensagemCampo(campo) {
        if (campo.validity.valueMissing) {
            return "Preencha este campo.";
        }

        if (campo.validity.typeMismatch) {
            return "Informe um e-mail válido.";
        }

        return "";
    }

    function obterAreaContato() {
        const radioSelecionado = formulario.querySelector('input[name="areaContato"]:checked');

        return radioSelecionado ? radioSelecionado.value : "";
    }

    function obterRadioAreaContato() {
        return formulario.querySelector('input[name="areaContato"]:checked');
    }

    function areaAtualEhCurriculo() {
        const radioSelecionado = obterRadioAreaContato();

        return Boolean(radioSelecionado && radioSelecionado.dataset.area === "curriculo");
    }

    function areaAtualEhServicos() {
        const radioSelecionado = obterRadioAreaContato();

        return Boolean(radioSelecionado && radioSelecionado.dataset.area === "servicos");
    }

    function areaAtualEhGeral() {
        const radioSelecionado = obterRadioAreaContato();

        return Boolean(radioSelecionado && radioSelecionado.dataset.area === "geral");
    }

    function obterCanalGeral() {
        const radioSelecionado = formulario.querySelector('input[name="canalGeral"]:checked');

        return radioSelecionado ? radioSelecionado.value : "whatsapp";
    }

    function envioAtualEhEmail() {
        return areaAtualEhServicos() || areaAtualEhCurriculo() || (areaAtualEhGeral() && obterCanalGeral() === "email");
    }

    function obterEmailDestino() {
        return areaAtualEhServicos() ? "eduardosantos@crservicos.com" : "contato@mrxservicos.com";
    }

    function atualizarAreaContato() {
        const radioSelecionado = obterRadioAreaContato();

        if (!radioSelecionado) {
            return;
        }

        if (campoAssunto && radioSelecionado.dataset.assuntoPlaceholder) {
            campoAssunto.placeholder = radioSelecionado.dataset.assuntoPlaceholder;
        }

        if (campoMensagem && radioSelecionado.dataset.mensagemPlaceholder) {
            campoMensagem.placeholder = radioSelecionado.dataset.mensagemPlaceholder;
        }

        const curriculoSelecionado = areaAtualEhCurriculo();
        const assuntoGeralSelecionado = areaAtualEhGeral();
        const servicosSelecionado = areaAtualEhServicos();
        document.body.classList.toggle("area-curriculo", curriculoSelecionado);
        document.body.classList.toggle("area-geral", assuntoGeralSelecionado);
        document.body.classList.toggle("area-servicos", servicosSelecionado);

        camposCondicionais.forEach(function(campo) {
            const ativo = campo.dataset.requiredArea === radioSelecionado.dataset.area;
            campo.required = ativo;

            if (!ativo) {
                campo.value = "";
                campo.setAttribute("aria-invalid", "false");

                const grupoCampo = campo.closest(".campo");
                const mensagemCampo = grupoCampo ? grupoCampo.querySelector(".mensagem-campo") : null;

                if (grupoCampo) {
                    grupoCampo.classList.remove("erro");
                }

                if (mensagemCampo) {
                    mensagemCampo.textContent = "";
                }
            }
        });

        if (campoCurriculo) {
            campoCurriculo.required = curriculoSelecionado;

            if (!curriculoSelecionado) {
                campoCurriculo.value = "";
                atualizarNomeCurriculo();
                campoCurriculo.setAttribute("aria-invalid", "false");
                const grupoCurriculo = campoCurriculo.closest(".campo");
                const mensagemCurriculo = grupoCurriculo ? grupoCurriculo.querySelector(".mensagem-campo") : null;

                if (grupoCurriculo) {
                    grupoCurriculo.classList.remove("erro");
                }

                if (mensagemCurriculo) {
                    mensagemCurriculo.textContent = "";
                }
            }
        }

        if (botaoEnviarContato) {
            botaoEnviarContato.innerHTML = envioAtualEhEmail()
                ? '<i class="bi bi-envelope"></i> Enviar por e-mail'
                : '<i class="bi bi-whatsapp"></i> Enviar no WhatsApp';
        }
    }

    function validarCurriculo() {
        if (!areaAtualEhCurriculo() || !campoCurriculo) {
            return true;
        }

        const mensagemCampo = prepararMensagemCampo(campoCurriculo);
        const grupoCampo = campoCurriculo.closest(".campo");
        const arquivo = campoCurriculo.files[0];
        let mensagem = "";

        if (!arquivo) {
            mensagem = "Anexe seu currículo em PDF ou DOCX.";
        } else if (!/\.(pdf|docx)$/i.test(arquivo.name)) {
            mensagem = "Use um arquivo PDF ou DOCX.";
        }

        if (grupoCampo) {
            grupoCampo.classList.toggle("erro", mensagem !== "");
        }

        if (mensagemCampo) {
            mensagemCampo.textContent = mensagem;
        }

        campoCurriculo.setAttribute("aria-invalid", mensagem !== "" ? "true" : "false");

        return mensagem === "";
    }

    function atualizarNomeCurriculo() {
        if (!ajudaCurriculo || !campoCurriculo) {
            return;
        }

        const arquivo = campoCurriculo.files[0];

        if (!arquivo) {
            ajudaCurriculo.textContent = "Nenhum arquivo selecionado. Formatos aceitos: PDF ou DOCX.";
            ajudaCurriculo.classList.remove("arquivo-selecionado");
            return;
        }

        ajudaCurriculo.textContent = `Arquivo selecionado: ${arquivo.name}`;
        ajudaCurriculo.classList.add("arquivo-selecionado");
    }

    function obterValorCampo(id) {
        const campo = document.getElementById(id);

        return campo ? campo.value.trim() : "";
    }

    function prepararMensagemCampo(campo) {
        const grupoCampo = campo.closest(".campo");

        if (!grupoCampo) {
            return null;
        }

        let mensagemCampo = grupoCampo.querySelector(".mensagem-campo");

        if (!mensagemCampo) {
            mensagemCampo = document.createElement("p");
            mensagemCampo.className = "mensagem-campo";
            mensagemCampo.id = `${campo.id || campo.name}Erro`;

            const mensagemAuxiliar = grupoCampo.querySelector(".mensagem-captcha");
            grupoCampo.insertBefore(mensagemCampo, mensagemAuxiliar || null);
        }

        const descricoesAtuais = campo.getAttribute("aria-describedby") || "";

        if (!descricoesAtuais.split(" ").includes(mensagemCampo.id)) {
            campo.setAttribute("aria-describedby", `${descricoesAtuais} ${mensagemCampo.id}`.trim());
        }

        return mensagemCampo;
    }

    function validarCampo(campo) {
        const grupoCampo = campo.closest(".campo");
        const mensagemCampo = prepararMensagemCampo(campo);
        const mensagem = obterMensagemCampo(campo);

        if (!grupoCampo || !mensagemCampo) {
            return campo.checkValidity();
        }

        grupoCampo.classList.toggle("erro", mensagem !== "");
        mensagemCampo.textContent = mensagem;
        campo.setAttribute("aria-invalid", mensagem !== "" ? "true" : "false");

        return mensagem === "";
    }

    function validarCamposFormulario() {
        const campos = Array.from(formulario.querySelectorAll("input[required], select[required], textarea[required]"));
        let primeiroCampoInvalido = null;

        campos.forEach(function(campo) {
            const campoValido = validarCampo(campo);

            if (!campoValido && !primeiroCampoInvalido) {
                primeiroCampoInvalido = campo;
            }
        });

        return primeiroCampoInvalido;
    }

    function limparFormulario() {
        formulario.reset();
        formulario.querySelectorAll(".campo.erro").forEach(function(campo) {
            campo.classList.remove("erro");
        });
        formulario.querySelectorAll(".mensagem-campo").forEach(function(mensagemCampo) {
            mensagemCampo.textContent = "";
        });
        formulario.querySelectorAll("[aria-invalid]").forEach(function(campo) {
            campo.setAttribute("aria-invalid", "false");
        });

        if (mensagemCaptcha) {
            mensagemCaptcha.textContent = "";
        }

        if (window.hcaptcha && typeof window.hcaptcha.reset === "function") {
            window.hcaptcha.reset();
        }

        atualizarAreaContato();
        atualizarNomeCurriculo();
    }

    function obterTokenHCaptcha() {
        const campoRespostaHCaptcha = formulario.querySelector('textarea[name="h-captcha-response"]');

        return campoRespostaHCaptcha ? campoRespostaHCaptcha.value.trim() : "";
    }

    function montarDadosEmail(dados) {
        const formData = new FormData();

        formData.append("_subject", dados.assunto);
        formData.append("_template", "table");
        formData.append("_captcha", "false");
        formData.append("_replyto", dados.email);
        formData.append("Nome", dados.nome);
        formData.append("Email", dados.email);
        formData.append("Telefone", dados.telefone || "Não informado");
        formData.append("Área de contato", dados.areaContato);
        formData.append("Canal escolhido", dados.canalGeral === "email" ? "E-mail" : "E-mail direto");
        formData.append("Destino", dados.emailDestino);
        formData.append("Assunto", dados.assunto);

        dados.detalhes.forEach(function(detalhe) {
            const separador = detalhe.indexOf(":");

            if (separador <= 0) {
                return;
            }

            formData.append(detalhe.slice(0, separador), detalhe.slice(separador + 1).trim());
        });

        formData.append("Mensagem", dados.mensagem);
        formData.append("Mensagem completa", dados.texto);

        if (campoCurriculo && campoCurriculo.files[0]) {
            formData.append("Currículo", campoCurriculo.files[0]);
        }

        return formData;
    }

    function montarDadosWeb3Forms(dados) {
        const formData = new FormData();
        const detalhesFormatados = dados.detalhes.length
            ? dados.detalhes.join("\n")
            : "Sem detalhes adicionais.";
        const textoEmail = [
            "Nova mensagem recebida pelo site da MRX Serviços.",
            "",
            "DADOS DO CONTATO",
            `Nome: ${dados.nome}`,
            `E-mail: ${dados.email}`,
            `Telefone: ${dados.telefone || "Não informado"}`,
            "",
            "SOLICITAÇÃO",
            `Área de contato: ${dados.areaContato}`,
            `Assunto: ${dados.assunto}`,
            `Canal escolhido: ${dados.canalGeral === "email" ? "E-mail" : "E-mail direto"}`,
            "",
            "DETALHES",
            detalhesFormatados,
            "",
            "MENSAGEM",
            dados.mensagem
        ].join("\n");

        formData.append("access_key", "8837ef5f-7c32-4b9a-b2b3-595bfbe0cc85");
        formData.append("subject", `[Site MRX] ${dados.areaContato} - ${dados.nome}`);
        formData.append("from_name", `Site MRX - ${dados.nome}`);
        formData.append("email", dados.email);
        formData.append("phone", dados.telefone || "Não informado");
        formData.append("message", textoEmail);
        formData.append("h-captcha-response", dados.hcaptcha);
        formData.append("Nome", dados.nome);
        formData.append("E-mail", dados.email);
        formData.append("Telefone", dados.telefone || "Não informado");
        formData.append("Área de contato", dados.areaContato);
        formData.append("Assunto", dados.assunto);
        formData.append("Mensagem", dados.mensagem);

        dados.detalhes.forEach(function(detalhe) {
            const separador = detalhe.indexOf(":");

            if (separador <= 0) {
                return;
            }

            formData.append(detalhe.slice(0, separador), detalhe.slice(separador + 1).trim());
        });

        if (campoCurriculo && campoCurriculo.files[0]) {
            formData.append("attachment", campoCurriculo.files[0]);
        }

        return formData;
    }

    function enviarEmailFormulario(dados) {
        return fetch("https://api.web3forms.com/submit", {
            method: "POST",
            body: montarDadosWeb3Forms(dados)
        }).then(function(resposta) {
            return resposta.json().catch(function() {
                return {};
            }).then(function(retorno) {
                if (!resposta.ok || !retorno.success) {
                    throw new Error(retorno.message || "Falha ao enviar mensagem.");
                }

                return retorno;
            });
        });
    }

    function abrirConfirmacao(texto, url, destino) {
        urlAcaoPendente = url;
        destinoAcaoPendente = destino;
        const envioEmail = destino === "email";
        const envioCurriculo = areaAtualEhCurriculo();

        if (previewMensagem) {
            previewMensagem.innerHTML = "";
            texto.split("\n").filter(function(linha) {
                return linha.trim() !== "";
            }).forEach(function(linha) {
                const itemPreview = document.createElement("div");
                const separador = linha.indexOf(":");

                itemPreview.className = "preview-linha";

                if (separador > 0) {
                    const rotulo = document.createElement("strong");
                    const valor = document.createElement("span");

                    rotulo.textContent = linha.slice(0, separador + 1);
                    valor.textContent = linha.slice(separador + 1).trim();
                    itemPreview.append(rotulo, valor);
                } else {
                    itemPreview.classList.add("preview-destaque");
                    itemPreview.textContent = linha;
                }

                previewMensagem.appendChild(itemPreview);
            });
        }

        if (tituloConfirmacao) {
            tituloConfirmacao.textContent = envioCurriculo
                ? "Confirmar envio de currículo"
                : envioEmail
                    ? "Confirmar envio por e-mail"
                    : "Revise sua mensagem";
        }

        if (textoConfirmacao) {
            textoConfirmacao.textContent = envioEmail
                ? "Ao confirmar, a mensagem sera enviada diretamente para o e-mail da equipe."
                : "Ao confirmar, os campos serao limpos e o WhatsApp sera aberto com o texto abaixo.";
        }

        if (notaConfirmacao) {
            notaConfirmacao.textContent = envioCurriculo
                ? "O arquivo selecionado sera enviado junto com a mensagem."
                : "";
            notaConfirmacao.classList.toggle("visivel", envioCurriculo);
        }

        if (confirmarEnvio) {
            confirmarEnvio.innerHTML = envioEmail
                ? '<i class="bi bi-envelope"></i> Confirmar e enviar e-mail'
                : '<i class="bi bi-whatsapp"></i> Confirmar e abrir WhatsApp';
        }

        if (modalConfirmacao) {
            modalConfirmacao.classList.add("visivel");
            modalConfirmacao.classList.toggle("envio-email", envioEmail);
            modalConfirmacao.setAttribute("aria-hidden", "false");
        }

        document.body.classList.add("modal-aberto");

        if (confirmarEnvio) {
            confirmarEnvio.focus();
        }
    }

    function fecharModalConfirmacao() {
        urlAcaoPendente = "";
        destinoAcaoPendente = "";
        dadosEmailPendentes = null;

        if (modalConfirmacao) {
            modalConfirmacao.classList.remove("visivel");
            modalConfirmacao.classList.remove("envio-email");
            modalConfirmacao.setAttribute("aria-hidden", "true");
        }

        document.body.classList.remove("modal-aberto");
    }

    function atualizarNotaConfirmacao(mensagem, visivel) {
        if (!notaConfirmacao) {
            return;
        }

        notaConfirmacao.textContent = mensagem;
        notaConfirmacao.classList.toggle("visivel", Boolean(visivel && mensagem));
    }

    formulario.querySelectorAll(".campo input, .campo select, .campo textarea").forEach(function(campo) {
        prepararMensagemCampo(campo);

        campo.addEventListener("input", function() {
            validarCampo(campo);
        });

        campo.addEventListener("change", function() {
            validarCampo(campo);
        });
    });

    formulario.addEventListener("submit", function(evento) {
        evento.preventDefault();

        if (campoSite && campoSite.value.trim() !== "") {
            return;
        }

        const primeiroCampoInvalido = validarCamposFormulario();
        const curriculoValido = validarCurriculo();

        if (primeiroCampoInvalido || !curriculoValido) {
            if (statusFormulario) {
                statusFormulario.textContent = "Revise os campos destacados antes de enviar.";
                statusFormulario.classList.add("erro");
            }

            if (primeiroCampoInvalido) {
                primeiroCampoInvalido.focus();
            } else if (campoCurriculo) {
                campoCurriculo.focus();
            }

            return;
        }

        const tokenHCaptcha = obterTokenHCaptcha();

        if (!tokenHCaptcha) {
            if (mensagemCaptcha) {
                mensagemCaptcha.textContent = "Confirme o anti-spam antes de enviar.";
            }

            if (statusFormulario) {
                statusFormulario.textContent = "Antes de enviar, confirme o anti-spam.";
                statusFormulario.classList.add("erro");
            }

            return;
        }

        if (mensagemCaptcha) {
            mensagemCaptcha.textContent = "";
        }

        const nome = document.getElementById("nome").value.trim();
        const email = document.getElementById("email").value.trim();
        const telefone = document.getElementById("telefone").value.trim();
        const areaContato = obterAreaContato();
        const canalGeral = areaAtualEhGeral() ? obterCanalGeral() : "";
        const assunto = campoAssunto.value.trim();
        const mensagem = campoMensagem.value.trim();
        const envioEmail = envioAtualEhEmail();
        const emailDestino = obterEmailDestino();
        const arquivoCurriculo = campoCurriculo && campoCurriculo.files[0] ? campoCurriculo.files[0].name : "";
        const detalhes = [];

        if (areaAtualEhServicos()) {
            detalhes.push(`Empresa: ${obterValorCampo("empresa")}`);
            detalhes.push(`Local do serviço: ${obterValorCampo("localProjeto")}`);
            detalhes.push(`Tipo de serviço: ${obterValorCampo("tipoServico")}`);
            detalhes.push(`Prazo desejado: ${obterValorCampo("prazoProjeto")}`);
        }

        if (areaAtualEhGeral()) {
            const melhorRetorno = obterValorCampo("melhorRetorno");

            if (melhorRetorno) {
                detalhes.push(`Melhor horário para retorno: ${melhorRetorno}`);
            }
        }

        if (areaAtualEhCurriculo()) {
            detalhes.push(`Área de interesse: ${obterValorCampo("areaInteresse")}`);
            detalhes.push(`Disponibilidade: ${obterValorCampo("disponibilidade")}`);
        }

        const texto = `Olá!
Nome: ${nome}
Email: ${email}
Telefone: ${telefone || "Não informado"}
Área de contato: ${areaContato}
${canalGeral ? `Canal escolhido: ${canalGeral === "email" ? "E-mail" : "WhatsApp"}\n` : ""}Destino: ${envioEmail ? emailDestino : "WhatsApp"}
Assunto: ${assunto}
${detalhes.length ? `${detalhes.join("\n")}\n` : ""}${arquivoCurriculo ? `Arquivo selecionado: ${arquivoCurriculo}\n` : ""}Mensagem: ${mensagem}`;

        const numero = "5521996120483";
        const url = envioEmail
            ? "email"
            : `https://wa.me/${numero}?text=${encodeURIComponent(texto)}`;

        dadosEmailPendentes = envioEmail ? {
            nome,
            email,
            telefone,
            areaContato,
            canalGeral,
            assunto,
            mensagem,
            emailDestino,
            detalhes,
            texto,
            hcaptcha: tokenHCaptcha
        } : null;

        if (statusFormulario) {
            statusFormulario.textContent = envioEmail
                ? "Revise a mensagem antes de enviar por e-mail."
                : "Revise a mensagem antes de abrir o WhatsApp.";
            statusFormulario.classList.remove("erro");
            statusFormulario.classList.remove("sucesso");
        }

        abrirConfirmacao(texto, url, envioEmail ? "email" : "whatsapp");
    });

    radiosAreaContato.forEach(function(radio) {
        radio.addEventListener("change", atualizarAreaContato);
    });

    radiosCanalGeral.forEach(function(radio) {
        radio.addEventListener("change", atualizarAreaContato);
    });

    atualizarAreaContato();

    if (campoCurriculo) {
        campoCurriculo.addEventListener("change", function() {
            atualizarNomeCurriculo();
            validarCurriculo();
        });
    }

    if (confirmarEnvio) {
        confirmarEnvio.addEventListener("click", function() {
            if (!urlAcaoPendente) {
                return;
            }

            const url = urlAcaoPendente;
            const envioEmail = destinoAcaoPendente === "email";

            if (envioEmail) {
                if (!dadosEmailPendentes) {
                    return;
                }

                confirmarEnvio.disabled = true;
                confirmarEnvio.innerHTML = '<i class="bi bi-envelope"></i> Enviando...';
                atualizarNotaConfirmacao("Enviando mensagem. Aguarde a confirmacao antes de fechar esta janela.", true);

                if (statusFormulario) {
                    statusFormulario.textContent = "Enviando mensagem por e-mail...";
                    statusFormulario.classList.remove("erro");
                    statusFormulario.classList.remove("sucesso");
                }

                enviarEmailFormulario(dadosEmailPendentes)
                    .then(function(retorno) {
                        fecharModalConfirmacao();
                        limparFormulario();

                        if (statusFormulario) {
                            statusFormulario.textContent = retorno.message || "Mensagem enviada com sucesso. Em breve entraremos em contato.";
                            statusFormulario.classList.remove("erro");
                            statusFormulario.classList.add("sucesso");
                        }
                    })
                    .catch(function(erro) {
                        const mensagemErro = erro && erro.message
                            ? erro.message
                            : "Nao foi possivel enviar automaticamente. Tente novamente ou use o WhatsApp.";

                        atualizarNotaConfirmacao(mensagemErro, true);

                        if (statusFormulario) {
                            statusFormulario.textContent = mensagemErro;
                            statusFormulario.classList.add("erro");
                            statusFormulario.classList.remove("sucesso");
                        }
                    })
                    .finally(function() {
                        confirmarEnvio.disabled = false;
                        confirmarEnvio.innerHTML = '<i class="bi bi-envelope"></i> Confirmar e enviar e-mail';
                    });
                return;
            }

            fecharModalConfirmacao();

            if (statusFormulario) {
                statusFormulario.textContent = "";
                statusFormulario.classList.remove("erro");
                statusFormulario.classList.remove("sucesso");
            }

            window.open(url, "_blank", "noopener");
            limparFormulario();
        });
    }

    [cancelarConfirmacao, fecharConfirmacao].forEach(function(botao) {
        if (!botao) {
            return;
        }

        botao.addEventListener("click", fecharModalConfirmacao);
    });

    if (modalConfirmacao) {
        modalConfirmacao.addEventListener("click", function(evento) {
            if (evento.target === modalConfirmacao) {
                fecharModalConfirmacao();
            }
        });
    }

    document.addEventListener("keydown", function(evento) {
        if (evento.key === "Escape") {
            fecharModalConfirmacao();
        }
    });
}

function configurarAutocompleteEmail() {
    const campoEmail = document.getElementById("email");
    const sugestoesEmail = document.getElementById("sugestoesEmail");

    if (!campoEmail || !sugestoesEmail) {
        return;
    }

    const dominios = [
        "gmail.com",
        "hotmail.com",
        "outlook.com",
        "yahoo.com.br",
        "icloud.com"
    ];

    function fecharSugestoesEmail() {
        sugestoesEmail.classList.remove("visivel");
        campoEmail.setAttribute("aria-expanded", "false");
    }

    function atualizarSugestoesEmail() {
        const valor = campoEmail.value.trim();
        const indiceArroba = valor.indexOf("@");

        sugestoesEmail.innerHTML = "";

        if (indiceArroba <= 0 || valor.indexOf("@", indiceArroba + 1) !== -1) {
            fecharSugestoesEmail();
            return;
        }

        const usuario = valor.slice(0, indiceArroba);
        const trechoDominio = valor.slice(indiceArroba + 1).toLowerCase();
        const sugestoes = dominios.filter(function(dominio) {
            return dominio.startsWith(trechoDominio);
        });

        if (sugestoes.length === 0) {
            fecharSugestoesEmail();
            return;
        }

        sugestoes.forEach(function(dominio) {
            const opcao = document.createElement("button");
            opcao.type = "button";
            opcao.role = "option";
            opcao.textContent = `${usuario}@${dominio}`;
            opcao.addEventListener("mousedown", function(evento) {
                evento.preventDefault();
                campoEmail.value = opcao.textContent;
                fecharSugestoesEmail();
            });
            sugestoesEmail.appendChild(opcao);
        });

        sugestoesEmail.classList.add("visivel");
        campoEmail.setAttribute("aria-expanded", "true");
    }

    campoEmail.addEventListener("input", atualizarSugestoesEmail);
    campoEmail.addEventListener("focus", atualizarSugestoesEmail);
    campoEmail.addEventListener("blur", function() {
        setTimeout(fecharSugestoesEmail, 120);
    });
}

function configurarMascaraTelefone() {
    const campoTelefone = document.getElementById("telefone");

    if (!campoTelefone) {
        return;
    }

    campoTelefone.addEventListener("input", function() {
        const numeros = campoTelefone.value.replace(/\D/g, "").slice(0, 11);
        const ddd = numeros.slice(0, 2);
        const primeiraParte = numeros.length > 10 ? numeros.slice(2, 7) : numeros.slice(2, 6);
        const segundaParte = numeros.length > 10 ? numeros.slice(7, 11) : numeros.slice(6, 10);

        if (numeros.length <= 2) {
            campoTelefone.value = ddd ? `(${ddd}` : "";
            return;
        }

        campoTelefone.value = segundaParte ? `(${ddd}) ${primeiraParte}-${segundaParte}` : `(${ddd}) ${primeiraParte}`;
    });
}

function configurarGaleria() {
    const botaoGaleria = document.getElementById("botaoGaleria");
    const gradeGaleria = document.getElementById("gradeGaleria");

    if (gradeGaleria) {
        const itensGaleria = Array.from(gradeGaleria.querySelectorAll(".item-galeria"));
        const quantidadeInicial = Math.min(4, itensGaleria.length);

        for (let indice = itensGaleria.length - 1; indice > 0; indice -= 1) {
            const indiceAleatorio = Math.floor(Math.random() * (indice + 1));
            [itensGaleria[indice], itensGaleria[indiceAleatorio]] = [itensGaleria[indiceAleatorio], itensGaleria[indice]];
        }

        itensGaleria.forEach(function(item, indice) {
            item.classList.toggle("foto-extra", indice >= quantidadeInicial);
            gradeGaleria.appendChild(item);
        });
    }

    const fotosExtras = document.querySelectorAll(".foto-extra");
    const secaoGaleria = gradeGaleria ? gradeGaleria.closest(".galeria-trabalhos") : null;
    const rotuloBotao = botaoGaleria ? botaoGaleria.querySelector(".texto-botao-galeria strong") : null;
    const detalheBotao = botaoGaleria ? botaoGaleria.querySelector(".texto-botao-galeria small") : null;
    const totalFotos = gradeGaleria ? gradeGaleria.querySelectorAll(".item-galeria").length : 0;
    const fotosVisiveisInicialmente = Math.max(totalFotos - fotosExtras.length, 0);

    if (!botaoGaleria || !gradeGaleria || fotosExtras.length === 0) {
        return;
    }

    function atualizarBotaoGaleria(galeriaAberta) {
        botaoGaleria.classList.toggle("galeria-expandida", galeriaAberta);
        botaoGaleria.setAttribute("aria-expanded", galeriaAberta ? "true" : "false");

        if (rotuloBotao) {
            rotuloBotao.textContent = galeriaAberta ? "Ver menos fotos" : "Ver mais fotos";
        }

        if (detalheBotao) {
            detalheBotao.textContent = galeriaAberta
                ? `Exibindo ${totalFotos} registros`
                : `Mais ${fotosExtras.length} de ${totalFotos} registros`;
        }
    }

    atualizarBotaoGaleria(false);

    botaoGaleria.addEventListener("click", function() {
        const galeriaAberta = fotosExtras[0].classList.contains("visivel");

        if (galeriaAberta) {
            botaoGaleria.classList.add("recolhendo");
            if (secaoGaleria) {
                const cabecalho = document.getElementById("cabecalho");
                const alturaCabecalho = cabecalho ? cabecalho.offsetHeight : 0;
                const topoGaleria = secaoGaleria.getBoundingClientRect().top + window.scrollY - alturaCabecalho + 70;

                window.scrollTo({
                    top: Math.max(topoGaleria, 0),
                    behavior: "smooth"
                });
            }

            fotosExtras.forEach(function(foto) {
                foto.classList.add("saindo");
            });

            setTimeout(function() {
                fotosExtras.forEach(function(foto) {
                    foto.classList.remove("visivel", "saindo");
                });
                gradeGaleria.classList.remove("galeria-aberta");
                botaoGaleria.classList.remove("recolhendo");
            }, 380);

            atualizarBotaoGaleria(false);
            return;
        }

        gradeGaleria.classList.add("galeria-aberta");
        botaoGaleria.classList.add("movendo");
        fotosExtras.forEach(function(foto) {
            foto.classList.add("visivel");
        });
        atualizarBotaoGaleria(true);

        setTimeout(function() {
            botaoGaleria.classList.remove("movendo");
        }, 360);
    });
}

function configurarLightboxGaleria() {
    const gradeGaleria = document.getElementById("gradeGaleria");

    if (!gradeGaleria) {
        return;
    }

    const lightbox = document.createElement("div");
    const figura = document.createElement("figure");
    const imagem = document.createElement("img");
    const botaoFechar = document.createElement("button");

    lightbox.className = "lightbox-galeria";
    lightbox.setAttribute("role", "dialog");
    lightbox.setAttribute("aria-modal", "true");
    lightbox.setAttribute("aria-hidden", "true");
    lightbox.setAttribute("aria-label", "Foto ampliada da galeria");

    botaoFechar.className = "fechar-lightbox";
    botaoFechar.type = "button";
    botaoFechar.setAttribute("aria-label", "Fechar foto ampliada");
    botaoFechar.innerHTML = '<i class="bi bi-x-lg"></i>';

    figura.append(imagem);
    lightbox.append(botaoFechar, figura);
    document.body.appendChild(lightbox);

    function fecharLightbox() {
        lightbox.classList.remove("aberto");
        lightbox.setAttribute("aria-hidden", "true");
        document.body.classList.remove("lightbox-aberto");
        imagem.removeAttribute("src");
        imagem.removeAttribute("alt");
    }

    function abrirLightbox(itemGaleria) {
        const foto = itemGaleria.querySelector("img");

        if (!foto) {
            return;
        }

        imagem.src = foto.currentSrc || foto.src;
        imagem.alt = foto.alt;
        lightbox.classList.add("aberto");
        lightbox.setAttribute("aria-hidden", "false");
        document.body.classList.add("lightbox-aberto");
        botaoFechar.focus();
    }

    gradeGaleria.addEventListener("click", function(evento) {
        const itemGaleria = evento.target.closest(".item-galeria");

        if (!itemGaleria) {
            return;
        }

        abrirLightbox(itemGaleria);
    });

    botaoFechar.addEventListener("click", fecharLightbox);

    lightbox.addEventListener("click", function(evento) {
        if (evento.target === lightbox) {
            fecharLightbox();
        }
    });

    document.addEventListener("keydown", function(evento) {
        if (evento.key === "Escape" && lightbox.classList.contains("aberto")) {
            fecharLightbox();
        }
    });
}

function configurarSlideComparativo() {
    const slidesComparativo = document.querySelectorAll(".trilho-comparativo .comparativo");
    const indicadoresSlide = document.querySelectorAll(".indicadores-slide button");
    const slideAnterior = document.getElementById("slideAnterior");
    const slideProximo = document.getElementById("slideProximo");
    const trilhoComparativo = document.querySelector(".trilho-comparativo");

    if (!slideAnterior || !slideProximo || !trilhoComparativo || slidesComparativo.length === 0) {
        return;
    }

    let slideAtual = 0;
    let autoplaySlide;
    let inicioToque = 0;
    let fimToque = 0;

    function mostrarSlide(indice) {
        slideAtual = (indice + slidesComparativo.length) % slidesComparativo.length;

        slidesComparativo.forEach(function(slide, posicao) {
            const slideAtivo = posicao === slideAtual;
            slide.classList.toggle("ativo", slideAtivo);
            slide.setAttribute("aria-hidden", slideAtivo ? "false" : "true");

            if (slideAtivo) {
                slide.querySelectorAll(".foto-comparativo").forEach(function(foto) {
                    foto.classList.add("revelado");
                });
            }
        });

        indicadoresSlide.forEach(function(indicador, posicao) {
            const indicadorAtivo = posicao === slideAtual;
            indicador.classList.toggle("ativo", indicadorAtivo);
            indicador.setAttribute("aria-current", indicadorAtivo ? "true" : "false");
        });
    }

    function iniciarAutoplay() {
        clearInterval(autoplaySlide);
        autoplaySlide = setInterval(function() {
            mostrarSlide(slideAtual + 1);
        }, 5000);
    }

    function pausarAutoplay() {
        clearInterval(autoplaySlide);
    }

    function trocarSlide(indice) {
        mostrarSlide(indice);
        iniciarAutoplay();
    }

    slideAnterior.addEventListener("click", function() {
        trocarSlide(slideAtual - 1);
    });

    slideProximo.addEventListener("click", function() {
        trocarSlide(slideAtual + 1);
    });

    indicadoresSlide.forEach(function(indicador, posicao) {
        indicador.addEventListener("click", function() {
            trocarSlide(posicao);
        });
    });

    trilhoComparativo.addEventListener("touchstart", function(evento) {
        inicioToque = evento.changedTouches[0].clientX;
        pausarAutoplay();
    });

    trilhoComparativo.addEventListener("touchend", function(evento) {
        fimToque = evento.changedTouches[0].clientX;
        const distancia = fimToque - inicioToque;

        if (Math.abs(distancia) < 45) {
            return;
        }

        trocarSlide(distancia < 0 ? slideAtual + 1 : slideAtual - 1);
    });

    [trilhoComparativo, slideAnterior, slideProximo].forEach(function(elemento) {
        elemento.addEventListener("mouseenter", pausarAutoplay);
        elemento.addEventListener("mouseleave", iniciarAutoplay);
        elemento.addEventListener("focusin", pausarAutoplay);
        elemento.addEventListener("focusout", iniciarAutoplay);
    });

    mostrarSlide(slideAtual);
    iniciarAutoplay();
}

function configurarFadeImagens() {
    const imagens = document.querySelectorAll("main img, footer img");

    imagens.forEach(function(imagem) {
        imagem.classList.add("fade-imagem");

        if (imagem.complete) {
            imagem.classList.add("imagem-carregada");
            return;
        }

        imagem.addEventListener("load", function() {
            imagem.classList.add("imagem-carregada");
        }, { once: true });
    });
}

function configurarBotaoTopo() {
    const botaoTopo = document.createElement("button");
    botaoTopo.className = "botao-topo";
    botaoTopo.type = "button";
    botaoTopo.setAttribute("aria-label", "Voltar ao topo");
    botaoTopo.innerHTML = '<i class="bi bi-arrow-up"></i>';

    document.body.appendChild(botaoTopo);

    function atualizarBotaoTopo() {
        botaoTopo.classList.toggle("visivel", window.scrollY > 520);
    }

    botaoTopo.addEventListener("click", function() {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });

    window.addEventListener("scroll", atualizarBotaoTopo, { passive: true });
    atualizarBotaoTopo();
}

function configurarAnimacoesDeEntrada() {
    const reduzirMovimento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const seletores = [
        ".hero-conteudo > *",
        ".hero-trabalho > div > *",
        ".card-servico",
        ".grade-servicos article",
        ".item-compromisso",
        ".numero-confianca",
        ".numeros-trabalho > div",
        ".diferencial",
        ".lista-atuacao div",
        ".item-mostruario",
        ".foto-comparativo",
        ".chamada-contato > *",
        ".chamada-trabalho > *"
    ];

    const elementos = Array.from(document.querySelectorAll(seletores.join(",")));
    const elementosHero = elementos.filter(function(elemento) {
        return Boolean(elemento.closest(".hero, .hero-trabalho"));
    });
    const elementosComScroll = elementos.filter(function(elemento) {
        return !elementosHero.includes(elemento);
    });

    if (reduzirMovimento || elementos.length === 0 || !("IntersectionObserver" in window)) {
        elementos.forEach(function(elemento) {
            elemento.classList.add("revelado");
        });
        return;
    }

    elementos.forEach(function(elemento, indice) {
        const grupo = elemento.parentElement;
        const posicaoNoGrupo = grupo ? Array.from(grupo.children).indexOf(elemento) : indice;
        const atrasosHeroInicio = [0, 110, 540, 720];
        const incrementoAtraso = elemento.matches(".grade-servicos article") ? 140 : 90;
        const atrasoMaximo = elemento.matches(".grade-servicos article") ? 520 : 360;
        const atraso = elemento.matches(".hero-conteudo > *")
            ? atrasosHeroInicio[posicaoNoGrupo] || 0
            : Math.min(Math.max(posicaoNoGrupo, 0) * incrementoAtraso, atrasoMaximo);

        elemento.classList.add("reveal-on-scroll");
        elemento.classList.remove("revelado");
        elemento.style.setProperty("--reveal-delay", `${atraso}ms`);
    });

    window.setTimeout(function() {
        elementosHero.forEach(function(elemento) {
            elemento.classList.add("revelado");
        });
    }, 140);

    const observador = new IntersectionObserver(function(entradas) {
        entradas.forEach(function(entrada) {
            if (!entrada.isIntersecting) {
                return;
            }

            entrada.target.classList.add("revelado");
            observador.unobserve(entrada.target);
        });
    }, {
        threshold: 0.16,
        rootMargin: "0px 0px -8% 0px"
    });

    const observadorTardio = new IntersectionObserver(function(entradas) {
        entradas.forEach(function(entrada) {
            if (!entrada.isIntersecting) {
                return;
            }

            entrada.target.classList.add("revelado");
            observadorTardio.unobserve(entrada.target);
        });
    }, {
        threshold: 0.22,
        rootMargin: "0px 0px -10% 0px"
    });

    elementosComScroll.forEach(function(elemento) {
        if (elemento.matches(".servicos-detalhados .grade-servicos article")) {
            observadorTardio.observe(elemento);
            return;
        }

        observador.observe(elemento);
    });
}

function configurarParallaxTrabalho() {
    const hero = document.querySelector(".hero-trabalho");
    const reduzirMovimento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!hero || reduzirMovimento) {
        return;
    }

    let aguardandoFrame = false;

    function atualizarParallax() {
        aguardandoFrame = false;

        if (window.innerWidth <= 680) {
            hero.style.setProperty("--hero-parallax", "0px");
            return;
        }

        const deslocamento = Math.min(window.scrollY * 0.12, 80);
        hero.style.setProperty("--hero-parallax", `${deslocamento}px`);
    }

    function solicitarAtualizacao() {
        if (aguardandoFrame) {
            return;
        }

        aguardandoFrame = true;
        window.requestAnimationFrame(atualizarParallax);
    }

    window.addEventListener("scroll", solicitarAtualizacao, { passive: true });
    window.addEventListener("resize", solicitarAtualizacao);
    atualizarParallax();
}

function configurarCarrosseisMobile() {
    const carrosseis = Array.from(document.querySelectorAll(".servicos .grade-servicos, .servicos-detalhados .grade-servicos, .galeria-trabalhos .grade-galeria, .area-contato .informacoes-contato, .campo-area .opcoes-area, .resumo-denuncia, .grade-orientacoes"));

    carrosseis.forEach(function(carrossel) {
        const itens = Array.from(carrossel.children);
        const carrosselEhGaleria = carrossel.classList.contains("grade-galeria");
        const carrosselEhAreaContato = carrossel.classList.contains("opcoes-area");
        let inicioToque = 0;
        let fimToque = 0;
        let inicioToqueVertical = 0;
        let fimToqueVertical = 0;

        if (itens.length < 2 || carrossel.dataset.carrosselConfigurado === "true") {
            return;
        }

        carrossel.dataset.carrosselConfigurado = "true";
        carrossel.setAttribute("tabindex", "0");
        carrossel.setAttribute("aria-label", carrosselEhGaleria ? "Galeria de fotos em esteira" : carrosselEhAreaContato ? "Escolha da area de contato" : "Cards em slide");

        const controles = document.createElement("div");
        const botaoAnterior = document.createElement("button");
        const botaoProximo = document.createElement("button");
        const indicadores = document.createElement("div");

        controles.className = "controles-carrossel-mobile";
        botaoAnterior.className = "controle-carrossel";
        botaoProximo.className = "controle-carrossel";
        indicadores.className = "indicadores-carrossel";

        botaoAnterior.type = "button";
        botaoProximo.type = "button";
        botaoAnterior.setAttribute("aria-label", carrosselEhGaleria ? "Ver foto anterior" : carrosselEhAreaContato ? "Ver area anterior" : "Ver card anterior");
        botaoProximo.setAttribute("aria-label", carrosselEhGaleria ? "Ver proxima foto" : carrosselEhAreaContato ? "Ver proxima area" : "Ver proximo card");
        botaoAnterior.innerHTML = '<i class="bi bi-chevron-left"></i>';
        botaoProximo.innerHTML = '<i class="bi bi-chevron-right"></i>';

        itens.forEach(function(_, indice) {
            const indicador = document.createElement("button");
            indicador.type = "button";
            indicador.setAttribute("aria-label", carrosselEhGaleria ? `Ver foto ${indice + 1}` : carrosselEhAreaContato ? `Ver area ${indice + 1}` : `Ver card ${indice + 1}`);
            indicador.addEventListener("click", function() {
                irParaIndice(indice);
            });
            indicadores.appendChild(indicador);
        });

        controles.append(botaoAnterior, indicadores, botaoProximo);
        carrossel.insertAdjacentElement("afterend", controles);

        function obterIndiceAtual() {
            const centroCarrossel = carrossel.getBoundingClientRect().left + (carrossel.clientWidth / 2);
            let indiceAtual = 0;
            let menorDistancia = Infinity;

            itens.forEach(function(item, indice) {
                const retanguloItem = item.getBoundingClientRect();
                const centroItem = retanguloItem.left + (retanguloItem.width / 2);
                const distancia = Math.abs(centroItem - centroCarrossel);

                if (distancia < menorDistancia) {
                    menorDistancia = distancia;
                    indiceAtual = indice;
                }
            });

            return indiceAtual;
        }

        function atualizarControles() {
            const indiceAtual = obterIndiceAtual();
            const botoesIndicadores = Array.from(indicadores.children);

            botoesIndicadores.forEach(function(indicador, indice) {
                indicador.classList.toggle("ativo", indice === indiceAtual);
            });

            botaoAnterior.disabled = !carrosselEhGaleria && indiceAtual === 0;
            botaoProximo.disabled = !carrosselEhGaleria && indiceAtual === itens.length - 1;

            if (carrosselEhAreaContato && window.innerWidth <= 720) {
                const radioAtual = itens[indiceAtual].querySelector('input[type="radio"]');

                if (radioAtual && !radioAtual.checked) {
                    radioAtual.checked = true;
                    radioAtual.dispatchEvent(new Event("change", { bubbles: true }));
                }
            }
        }

        function irParaIndice(indice) {
            const proximoIndice = carrosselEhGaleria
                ? (indice + itens.length) % itens.length
                : Math.min(Math.max(indice, 0), itens.length - 1);

            carrossel.scrollTo({
                left: itens[proximoIndice].offsetLeft - carrossel.offsetLeft - ((carrossel.clientWidth - itens[proximoIndice].offsetWidth) / 2),
                behavior: "smooth",
            });
        }

        function moverCarrossel(direcao) {
            const indiceAtual = obterIndiceAtual();

            irParaIndice(indiceAtual + direcao);
        }

        botaoAnterior.addEventListener("click", function() {
            moverCarrossel(-1);
        });

        botaoProximo.addEventListener("click", function() {
            moverCarrossel(1);
        });

        itens.forEach(function(item, indice) {
            item.addEventListener("click", function() {
                if (carrosselEhAreaContato && window.innerWidth > 720) {
                    return;
                }

                if (indice !== obterIndiceAtual()) {
                    irParaIndice(indice);
                    return;
                }

                if (carrosselEhAreaContato) {
                    const radioAtual = item.querySelector('input[type="radio"]');

                    if (radioAtual && !radioAtual.checked) {
                        radioAtual.checked = true;
                        radioAtual.dispatchEvent(new Event("change", { bubbles: true }));
                    }
                }
            });
        });

        carrossel.addEventListener("touchstart", function(evento) {
            inicioToque = evento.changedTouches[0].clientX;
            inicioToqueVertical = evento.changedTouches[0].clientY;
            fimToque = inicioToque;
            fimToqueVertical = inicioToqueVertical;
        }, { passive: true });

        carrossel.addEventListener("touchmove", function(evento) {
            fimToque = evento.changedTouches[0].clientX;
            fimToqueVertical = evento.changedTouches[0].clientY;
        }, { passive: true });

        carrossel.addEventListener("touchend", function() {
            const distancia = fimToque - inicioToque;
            const distanciaVertical = fimToqueVertical - inicioToqueVertical;

            if (Math.abs(distancia) < 42 || Math.abs(distanciaVertical) > Math.abs(distancia)) {
                return;
            }

            moverCarrossel(distancia < 0 ? 1 : -1);
        }, { passive: true });

        carrossel.addEventListener("scroll", function() {
            window.requestAnimationFrame(atualizarControles);
        }, { passive: true });

        window.addEventListener("resize", atualizarControles);
        atualizarControles();
    });
}

function configurarCompromissosMobile() {
    const listaCompromissos = document.querySelector(".compromissos");

    if (!listaCompromissos || listaCompromissos.dataset.compromissosConfigurado === "true") {
        return;
    }

    const itens = Array.from(listaCompromissos.querySelectorAll(".item-compromisso"));

    if (itens.length < 2) {
        return;
    }

    const consultaMobile = window.matchMedia("(max-width: 680px)");
    let indiceAtual = 0;
    let intervaloCompromissos;
    let timeoutAnimacaoCompromissos;

    listaCompromissos.dataset.compromissosConfigurado = "true";

    function mostrarCompromisso(proximoIndice) {
        const indiceAnterior = indiceAtual;
        indiceAtual = (proximoIndice + itens.length) % itens.length;

        itens.forEach(function(item, indice) {
            item.classList.toggle("compromisso-ativo", indice === indiceAtual);
            item.classList.toggle("compromisso-entrando", indice === indiceAtual && indiceAnterior !== indiceAtual);
            item.classList.toggle("compromisso-saindo", indice === indiceAnterior && indiceAnterior !== indiceAtual);
        });

        clearTimeout(timeoutAnimacaoCompromissos);
        timeoutAnimacaoCompromissos = window.setTimeout(function() {
            itens.forEach(function(item) {
                item.classList.remove("compromisso-entrando", "compromisso-saindo");
            });
        }, 640);
    }

    function pararCarrossel() {
        clearInterval(intervaloCompromissos);
        intervaloCompromissos = null;
    }

    function iniciarCarrossel() {
        if (intervaloCompromissos) {
            return;
        }

        itens.forEach(function(item, indice) {
            item.classList.toggle("compromisso-ativo", indice === indiceAtual);
            item.classList.remove("compromisso-entrando", "compromisso-saindo");
        });

        intervaloCompromissos = setInterval(function() {
            mostrarCompromisso(indiceAtual + 1);
        }, 5400);
    }

    function desativarCarrossel() {
        pararCarrossel();
        clearTimeout(timeoutAnimacaoCompromissos);
        itens.forEach(function(item) {
            item.classList.remove("compromisso-ativo", "compromisso-entrando", "compromisso-saindo");
        });
        indiceAtual = 0;
    }

    function atualizarEstado() {
        if (consultaMobile.matches) {
            iniciarCarrossel();
            return;
        }

        desativarCarrossel();
    }

    if (typeof consultaMobile.addEventListener === "function") {
        consultaMobile.addEventListener("change", atualizarEstado);
    } else if (typeof consultaMobile.addListener === "function") {
        consultaMobile.addListener(atualizarEstado);
    }

    atualizarEstado();
}

window.addEventListener("scroll", atualizarCabecalhoAoRolar, { passive: true });

document.addEventListener("DOMContentLoaded", function() {
    atualizarCabecalhoAoRolar();
    configurarMenuMobile();
    configurarLinksDaPaginaAtual();
    configurarFormularioWhatsApp();
    configurarAutocompleteEmail();
    configurarMascaraTelefone();
    configurarFadeImagens();
    configurarGaleria();
    configurarLightboxGaleria();
    configurarSlideComparativo();
    configurarBotaoTopo();
    configurarAnimacoesDeEntrada();
    configurarParallaxTrabalho();
    configurarCarrosseisMobile();
    configurarCompromissosMobile();
});
