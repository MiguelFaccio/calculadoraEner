let objetos = [];
let comodoAtual = 'Sala';
let tarifaE;

function tarifaEnergetica() {
    tarifaE = parseFloat(document.getElementById('tarifa').value);
    alert("Tarifa definida: " + tarifaE);  // Alerta para confirmar que a tarifa foi capturada
}



function abrirModal(tipo) {
    document.getElementById('modal-title').innerText = tipo;
    document.getElementById('modal').style.display = 'block';
}

function fecharModal() {
    document.getElementById('modal').style.display = 'none';
}

function adicionarObjeto() {
    if (typeof tarifaE === 'undefined') {
        alert('Por favor, defina a tarifa energética antes de adicionar um objeto.');
        return; // Sai da função se tarifaE não estiver definida
    }

    const tipo = document.getElementById('modal-title').innerText;
    const potencia = parseFloat(document.getElementById('potencia').value);
    const tempo = parseFloat(document.getElementById('tempo').value);  

    if (isNaN(potencia) || isNaN(tempo)) {
        alert('Por favor, preencha todos os campos corretamente.');
        return;
    }
    const consumo = (potencia / 1000) * tempo ;;
    const consumoMensal = (consumo * 30) ;;  // consumo mensal em kWh
    const custoD = consumo * tarifaE; // 
    const custoM = consumoMensal * tarifaE; // 
    
    // Verifica se o objeto já existe e atualiza
    let objetoExistente = objetos.find(obj => obj.tipo === tipo);
    if (objetoExistente) {
        objetoExistente.consumo = consumo;
        objetoExistente.consumoMensal = consumoMensal;
        objetoExistente.custoD = custoD;
        objetoExistente.custoM = custoM;

    } else {
        objetos.push({ tipo, consumo, consumoMensal, custoD, custoM });
    }

    fecharModal();
    atualizarResultados();
    atualizarResultadosM();
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
                label: `Consumo Diário (kWh) - ${comodoAtual}`,
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

    document.getElementById('resultado').innerHTML = resultadoHTML;

}
function atualizarResultadosM() {
    const ctx = document.getElementById('graficoCM').getContext('2d');
    const labels = objetos.map(obj => obj.tipo);
    const data = objetos.map(obj => obj.consumoMensal);

    // Destruir o gráfico existente para evitar erros
    if (window.consumoMChart) {
        window.consumoMChart.destroy();
    }

    window.consumoMChart = new Chart(ctx, {
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


    let resultadoMensalHTML = `<h3>Resultado Mensal  </h3>`;
    objetos.forEach(obj => {
        resultadoMensalHTML += `<p>${obj.tipo}: Consumo Mensal = ${obj.consumoMensal.toFixed(2)} kWh, Custo = R$ ${obj.custoM.toFixed(2)}</p>`;
    });

    document.getElementById('resultadoM').innerHTML = resultadoMensalHTML;
}

document.getElementById('trocar-comodo').addEventListener('click', function() {
    comodoAtual = prompt('Digite o nome do novo cômodo:');
    objetos = []; // Limpa os objetos ao trocar de cômodo
    atualizarResultados();
    atualizarResultadosM();
});

document.getElementById('salvar').addEventListener('click', function() {
    // Lógica para salvar os resultados
    alert('Resultados salvos com sucesso!');
});
