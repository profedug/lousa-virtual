document.getElementById('geneticsForm').addEventListener('submit', function (e) {
  e.preventDefault();

  // Obter genótipos dos pais e fenótipo desejado
  const parent1 = document.getElementById('parent1').value.toUpperCase();
  const parent2 = document.getElementById('parent2').value.toUpperCase();
  const desiredPhenotype = document.getElementById('desiredPhenotype').value.toUpperCase();

  // Validar genótipos
  if (!isValidGenotype(parent1) || !isValidGenotype(parent2)) {
    alert("Por favor, insira genótipos válidos (ex.: AaBb, AABB, aaBb).");
    return;
  }

  // Calcular combinações
  const combinations = getCombinations(parent1, parent2);

  // Calcular probabilidades
  const genotypeProbabilities = calculateProbabilities(combinations.genotypes);
  const phenotypeProbabilities = calculateProbabilities(combinations.phenotypes);

  // Exibir resultados
  displayResults(genotypeProbabilities, phenotypeProbabilities, desiredPhenotype);
  displayPunnettSquare(combinations.genotypes, parent1, parent2);
});

function isValidGenotype(genotype) {
  return /^[A-Za-z]{4}$/.test(genotype); // Verifica se são 4 letras (2 genes)
}

function getCombinations(parent1, parent2) {
  const genotypes = [];
  const phenotypes = [];

  // Gerar gametas para cada progenitor
  const gametes1 = getGametes(parent1);
  const gametes2 = getGametes(parent2);

  // Combinar gametas
  for (const gamete1 of gametes1) {
    for (const gamete2 of gametes2) {
      const genotype = gamete1 + gamete2;
      const phenotype = getPhenotype(genotype);

      genotypes.push(genotype);
      phenotypes.push(phenotype);
    }
  }

  return { genotypes, phenotypes };
}

function getGametes(genotype) {
  const gametes = [];
  for (let i = 0; i < 2; i++) {
    for (let j = 2; j < 4; j++) {
      gametes.push(genotype[i] + genotype[j]);
    }
  }
  return gametes;
}

function getPhenotype(genotype) {
  // Supondo que A e B são dominantes
  const phenotypeA = genotype.includes('A') ? 'A_' : 'aa';
  const phenotypeB = genotype.includes('B') ? 'B_' : 'bb';
  return phenotypeA + phenotypeB;
}

function calculateProbabilities(items) {
  const probabilities = {};

  items.forEach(item => {
    probabilities[item] = (probabilities[item] || 0) + 1;
  });

  for (const key in probabilities) {
    probabilities[key] = (probabilities[key] / items.length) * 100;
  }

  return probabilities;
}

function displayResults(genotypeProbabilities, phenotypeProbabilities, desiredPhenotype) {
  const genotypeResults = document.getElementById('genotypeResults');
  const phenotypeResults = document.getElementById('phenotypeResults');

  genotypeResults.innerHTML = '';
  phenotypeResults.innerHTML = '';

  // Exibir probabilidades dos genótipos
  for (const [genotype, probability] of Object.entries(genotypeProbabilities)) {
    genotypeResults.innerHTML += `<li>${genotype}: ${probability.toFixed(2)}%</li>`;
  }

  // Exibir probabilidades dos fenótipos
  if (desiredPhenotype) {
    const probability = phenotypeProbabilities[desiredPhenotype] || 0;
    phenotypeResults.innerHTML += `<li>${desiredPhenotype}: ${probability.toFixed(2)}%</li>`;
  } else {
    for (const [phenotype, probability] of Object.entries(phenotypeProbabilities)) {
      phenotypeResults.innerHTML += `<li>${phenotype}: ${probability.toFixed(2)}%</li>`;
    }
  }
}

function displayPunnettSquare(genotypes, parent1, parent2) {
  const table = document.getElementById('punnettTable');
  table.innerHTML = '';

  // Gerar cabeçalho da tabela
  const headerRow = document.createElement('tr');
  headerRow.innerHTML = `<th></th><th>${parent1[0]}${parent1[2]}</th><th>${parent1[0]}${parent1[3]}</th><th>${parent1[1]}${parent1[2]}</th><th>${parent1[1]}${parent1[3]}</th>`;
  table.appendChild(headerRow);

  // Gerar linhas da tabela
  const gametes2 = getGametes(parent2);
  for (let i = 0; i < 4; i++) {
    const row = document.createElement('tr');
    row.innerHTML = `<th>${gametes2[i]}</th><td>${genotypes[i * 4]}</td><td>${genotypes[i * 4 + 1]}</td><td>${genotypes[i * 4 + 2]}</td><td>${genotypes[i * 4 + 3]}</td>`;
    table.appendChild(row);
  }
}
