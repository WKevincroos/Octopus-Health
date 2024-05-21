// Recupera os valores dos parâmetros da URL (se houver).
let peso = obterParametroURL("peso");
let idade = obterParametroURL("idade");
let altura = obterParametroURL("altura");
let tempo_exercicio = obterParametroURL("tempo_exercicio");
let genero = obterParametroURL("genero");
let is_anonimized = false;
let content = document.querySelector('.container');

const ESTADOS = ["Magreza", "Normal", "Sobrepeso", "Obesidade Grau I", "Obesidade Grau II", "Obesidade Grau III"]

// CÓDIGO DE INTERFACE -------------------------------------

function start() {
  content.style.visibility = 'visible';
  content.style.opacity = '1';
  if (peso && idade && altura && tempo_exercicio && genero) obter_resultado();
}

// FIM DO CÓDIGO DE INTERFACE ---------------------------------------

// UTILITÁRIOS ------------------------------------------------------

// Função para obter parâmetros da URL
function obterParametroURL(nomeParametro) {
  var urlSearchParams = new URLSearchParams(window.location.search);
  console.log(urlSearchParams.get(nomeParametro))
  return urlSearchParams.get(nomeParametro);
}

// Devolve o resultado de todos os cálculos.
function calculate() {
  // Recebe os valores do formulário.
  peso = parseFloat(document.getElementById('peso').value);
  idade = parseInt(document.getElementById('idade').value);
  altura = parseFloat(document.getElementById('altura').value) / 100;
  tempo_exercicio = parseInt(document.getElementById('tempo_exercicio').value);
  genero = document.querySelector('input[name="gender"]:checked').id;

  setTimeout(
    function() {
      content.style.opacity = '0';
      setTimeout(() => { content.style.visibility = 'hidden'; }, 100)
    },
    100)

  setTimeout(
    () => {
      window.location.href = "Resultado/result.html?peso=" + peso + "&idade=" + idade + "&altura=" + altura + "&tempo_exercicio=" + tempo_exercicio + "&genero=" + genero;
    },
    250)
}

// Escreve o resultado na tela.
function obter_resultado() {
  let x = (calcular_calorias_ideal()[1] >= 0 ? "consumir " : "eliminar ")
  let y = (calcular_calorias_ideal()[0] >= 1 ? " perder" : " ganhar")

  document.getElementById("estado-resultado").placeholder = ESTADOS[calcular_calorias_ideal()[0]]
  document.getElementById("imc-resultado").placeholder = calcular_imc() + " kg/m²."
  document.getElementById("agua-resultado").placeholder = calcular_consumo_de_agua() + " litros d'água p/ dia."
  document.getElementById("calorias-resultado").placeholder = calcular_metabolismo_basal() + " Kcal."
  document.getElementById("dieta-resultado").innerHTML = (calcular_calorias_ideal()[0] === 1 ? "Parabéns, você está se alimentando corretamente e precisa apenas repôr suas calorias perdidas :)" : "Você precisa " + x + Math.abs(calcular_calorias_ideal()[1]) + " Kcal por dia para" + y + " massa e se enquadrar no seu peso ideal.")
}

// Salva todos os dados obtidos em um arquivo formato PDF.
function salvar_resultado() {
  document.getElementById("calcular").innerHTML = "*Este documento não possui validade jurídica, e não é avaliado pela OMS ;)"
  print()
  window.location.href = "../index.html"
}

// Transforma os caracteres dos campos de texto em algarismos secretos.
function anonimatize() {
  if (!is_anonimized) {
    is_anonimized = true
    document.getElementById('peso').type = "password";
    document.getElementById('idade').type = "password";
    document.getElementById('altura').type = "password";
    document.getElementById('tempo_exercicio').type = "password";
  }
  else {
    is_anonimized = false
    document.getElementById('peso').type = "number";
    document.getElementById('idade').type = "number";
    document.getElementById('altura').type = "number";
    document.getElementById('tempo_exercicio').type = "number";
  }
}

// FIM DOS UTILITÁRIOS ----------------------------------------------

//Esta função calcula o estado em que o usuário se enquadra, baseado no IMC.
function devolver_estado() {
  let imc = calcular_imc()
  if (imc < 18.5) return 0 //Magreza
  else if (imc >= 18.5 && imc <= 24.9) return 1 //Normal
  else if (imc >= 25 && imc <= 29.9) return 2 //Sobrepeso
  else if (imc >= 30 && imc <= 34.9) return 3 //Obesidade I
  else if (imc >= 35 && imc <= 39.9) return 4 //Obesidade II
  else return 5 //Obesidade III
}

// Esta função calcula a quantidade de água ideal por pessoa em função do peso.
function calcular_consumo_de_agua() {
  let consumo = peso * 0.040;
  return Number.parseFloat(consumo).toFixed(2);
}

// Esta função calcula o índice de massa corpórea de acordo com a altura e o peso.
function calcular_imc() {
  let imc = peso / (altura * altura);
  return Number.parseFloat(imc).toFixed(2);
}

// Esta função produz um cálculo de calorias ideais para o usuário consumir por dia.
function calcular_calorias_ideal() {
  let estado = devolver_estado();
  let calorias = 0

  // Calcula o gasto energético basal (TMP * fator de atividade)
  if (tempo_exercicio <= 60) calorias = calcular_metabolismo_basal() * 1.55
  else if (tempo_exercicio >= 61 && tempo_exercicio <= 540) calorias = calcular_metabolismo_basal() * 1, 84
  else calorias = calcular_metabolismo_basal() * 2, 20

  // ganhar peso = calorias ideal + 500
  // perder peso = calorias ideal - 500
  // manter peso = calorias ideal

  if (estado < 1) calorias += 500
  else if (estado > 1) calorias -= 500
  else calorias += 0;
  return [estado, Number.parseFloat(calorias).toFixed(2)]
}

// Esta função calcula a quantidade de calorias que o corpo do usuário consome diariamente em suas atividades vitais,baseado na fórmula proposta por Harris-Benedict.
function calcular_metabolismo_basal() {
  let calorias = 0

  switch (genero) {
    case "masculino":
      calorias = 66 + (13.7 * peso) + (5 * (altura * 100)) - (6.8 * idade)
      break;

    case "feminino":
      calorias = 655 + (9.6 * peso) + (1.8 * (altura * 100)) - (4.7 * idade)
      break;
  }
  return Number.parseFloat(calorias).toFixed(0);
}

start()

// fontes (https://www.ncbi.nlm.nih.gov/pmc/articles/PMC1091498/pdf/pnas01945-0018.pdf) TMP