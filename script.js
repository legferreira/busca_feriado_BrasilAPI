

const campoAno = document.getElementById('ano')
const tabela = document.getElementById('tabelaFeriados')
const mensagem = document.getElementById('mensagem')
const total = document.getElementById('total')
const proximo = document.getElementById('proximo')

const diasDaSemana = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']


campoAno.value = new Date().getFullYear()

function consultarFeriados() {
    const ano = campoAno.value
    tabela.innerHTML = ''
    mensagem.innerHTML = ''
    total.innerHTML = ''
    proximo.innerHTML = ''

    fetch(`https://brasilapi.com.br/api/feriados/v1/${ano}`)
        .then(resposta => {
            if (!resposta.ok) {
                throw new Error('Ano inválido. Digite um ano entre 1900 e 2199.')
            }
            return resposta.json()
        })
        .then(feriados => {
            console.log(feriados)

            total.innerHTML = `Total de feriados em ${ano}: <strong>${feriados.length}</strong>`

            feriados.forEach(feriado => {
        
                const data = new Date(feriado.date + 'T12:00:00')

                const dataBR = data.toLocaleDateString('pt-BR')
                const numeroDia = data.getDay()
                const diaSemana = diasDaSemana[numeroDia]
                let classe = ''
                if (numeroDia === 0 || numeroDia === 6) {
                    classe = 'fim-de-semana'
                }

                tabela.innerHTML += `
                    <tr class="${classe}">
                        <td>${dataBR}</td>
                        <td>${diaSemana}</td>
                        <td>${feriado.name}</td>
                    </tr>`
            })

            mostrarProximoFeriado(feriados)
        })
        .catch(erro => {
            mensagem.innerHTML = erro.message
            mensagem.className = 'erro'
            console.log(erro)
        })
}

function mostrarProximoFeriado(feriados) {
    const hoje = new Date()
    hoje.setHours(12, 0, 0, 0)

    const proximoFeriado = feriados.find(feriado => {
        const data = new Date(feriado.date + 'T12:00:00')
        return data >= hoje
    })

    if (!proximoFeriado) {
        proximo.innerHTML = ''
        return
    }

    const data = new Date(proximoFeriado.date + 'T12:00:00')
    const umDia = 1000 * 60 * 60 * 24
    const diasFaltando = Math.round((data - hoje) / umDia)

    let texto = `Faltam <strong>${diasFaltando} dias</strong>`
    if (diasFaltando === 0) {
        texto = '<strong>É hoje!</strong>'
    } else if (diasFaltando === 1) {
        texto = 'Falta <strong>1 dia</strong>'
    }

    proximo.innerHTML = `
        <p>Próximo feriado: <strong>${proximoFeriado.name}</strong>
        (${data.toLocaleDateString('pt-BR')}, ${diasDaSemana[data.getDay()]})</p>
        <p>${texto}</p>`
}

document.getElementById('btnConsultar').addEventListener('click', consultarFeriados)

consultarFeriados()
