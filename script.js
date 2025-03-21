document.getElementById('muvForm').addEventListener('submit', function (e) {
  e.preventDefault();

  // Obter valores do formulário
  const initialVelocity = parseFloat(document.getElementById('initialVelocity').value);
  const acceleration = parseFloat(document.getElementById('acceleration').value);
  const time = parseFloat(document.getElementById('time').value);

  // Calcular velocidade final e distância percorrida
  const finalVelocity = initialVelocity + acceleration * time;
  const distance = initialVelocity * time + 0.5 * acceleration * Math.pow(time, 2);

  // Exibir resultados
  document.getElementById('finalVelocity').textContent = finalVelocity.toFixed(2);
  document.getElementById('distance').textContent = distance.toFixed(2);

  // Gerar gráficos
  generateCharts(initialVelocity, acceleration, time);
});

function generateCharts(initialVelocity, acceleration, time) {
  const timeData = [];
  const velocityData = [];
  const distanceData = [];

  for (let t = 0; t <= time; t += 0.1) {
    timeData.push(t);
    velocityData.push(initialVelocity + acceleration * t);
    distanceData.push(initialVelocity * t + 0.5 * acceleration * Math.pow(t, 2));
  }

  // Gráfico de Velocidade vs. Tempo
  const velocityCtx = document.getElementById('velocityChart').getContext('2d');
  new Chart(velocityCtx, {
    type: 'line',
    data: {
      labels: timeData,
      datasets: [{
        label: 'Velocidade (m/s)',
        data: velocityData,
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 2,
        fill: false,
      }],
    },
    options: {
      scales: {
        x: {
          title: {
            display: true,
            text: 'Tempo (s)',
          },
        },
        y: {
          title: {
            display: true,
            text: 'Velocidade (m/s)',
          },
        },
      },
    },
  });

  // Gráfico de Distância vs. Tempo
  const distanceCtx = document.getElementById('distanceChart').getContext('2d');
  new Chart(distanceCtx, {
    type: 'line',
    data: {
      labels: timeData,
      datasets: [{
        label: 'Distância (m)',
        data: distanceData,
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 2,
        fill: false,
      }],
    },
    options: {
      scales: {
        x: {
          title: {
            display: true,
            text: 'Tempo (s)',
          },
        },
        y: {
          title: {
            display: true,
            text: 'Distância (m)',
          },
        },
      },
    },
  });
}
