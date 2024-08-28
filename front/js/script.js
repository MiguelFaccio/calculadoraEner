let objetos = [];
let comodoAtual = 'Sala';

function tarifaEnergetica(){
    const tarifaE = parseFloat(document.getElementById('tarifa').value);
}


function abrirModal(tipo) {
    document.getElementById('modal-title').innerText = tipo;
    document.getElementById('modal').style.display = 'block';
}

function fecharModal() {
    document.getElementById('modal').style.display = 'none';
}

function adicionarObjeto() {
    const tipo = document.getElementById('modal-title').innerText;
    const potencia = parseFloat(document.getElementById('potencia').value);
    const tempo = parseFloat(document.getElementById('tempo').value);

    const consumo = (potencia * tempo * 30) / 1000; // consumo mensal em kWh
    const custo = consumo * custoKwh; // custo mensal em R$
    
    // Verifica se o objeto já existe e atualiza
    let objetoExistente = objetos.find(obj => obj.tipo === tipo);
    if (objetoExistente) {
        objetoExistente.consumo = consumo;
        objetoExistente.custo = custo;
    } else {
        objetos.push({ tipo, consumo, custo });
    }

    fecharModal();
    atualizarResultados();
}

function atualizarResultados() {
    const ctx = document.getElementById('graficoConsumo').getContext('2d');
    const labels = objetos.map(obj => obj.tipo);
    const data = objetos.map(obj => obj.consumo);

    // Destruir o gráfico existente para evitar erros
    if (window.consumoChart) {
        window.consumoChart.destroy();
    }

    window.consumoChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: `Consumo Mensal (kWh) - ${comodoAtual}`,
                data: data,
                backgroundColor: 'rgba(79, 179, 183, 0.6)',
                borderColor: 'rgba(79, 179, 183, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    let resultadoHTML = `<h3>Resultados - ${comodoAtual}</h3>`;
    objetos.forEach(obj => {
        resultadoHTML += `<p>${obj.tipo}: Consumo = ${obj.consumo.toFixed(2)} kWh, Custo = R$ ${obj.custo.toFixed(2)}</p>`;
    });

    document.getElementById('resultadoMensal').innerHTML = resultadoMensalHTML;
    let resultadoMensalHTML = `<h3>Resultado Mensal  </h3>`;
    objetos.forEach(obj => {
        resultadoMensalHTML += `<p>${obj.tipo}: Consumo Mensal = ${obj.consumoMensal.toFixed(2)} kWh, Custo = R$ ${obj.custoMensal.toFixed(2)}</p>`;
    });

    document.getElementById('resultado').innerHTML = resultadoHTML;
}

document.getElementById('trocar-comodo').addEventListener('click', function() {
    comodoAtual = prompt('Digite o nome do novo cômodo:');
    objetos = []; // Limpa os objetos ao trocar de cômodo
    atualizarResultados();
});

document.getElementById('salvar').addEventListener('click', function() {
    // Lógica para salvar os resultados
    alert('Resultados salvos com sucesso!');
});
