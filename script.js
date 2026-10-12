const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

const mapeamentoTeclado = {
    'a': '261.63',
    's': '293.66',
    'd': '329.63',
    'f': '349.23',
    'g': '392.00',
    'h': '440.00',
    'j': '493.88'
};

function tocarNota(frequencia) {
    if (!frequencia) return;

    const oscilador = audioCtx.createOscillator();
    const ganho = audioCtx.createGain();

    oscilador.type = 'sine';
    oscilador.frequency.setValueAtTime(frequencia, audioCtx.currentTime);

    ganho.gain.setValueAtTime(2 , audioCtx.currentTime);
    ganho.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.5);

    oscilador.connect(ganho);
    ganho.connect(audioCtx.destination);

    oscilador.start();
    oscilador.stop(audioCtx.currentTime + 0.5);

    const circulo = document.getElementById('circulo');
    const escalaAumento = 1 + (frequencia / 300);
    
    circulo.style.transform = `scale(${escalaAumento})`;
    circulo.style.backgroundColor = `hsl(${frequencia % 360}, 80%, 50%)`;

    setTimeout(() => {
        circulo.style.transform = 'scale(1)';
    }, 150);
}

document.querySelectorAll('.tecla').forEach(tecla => {
    tecla.addEventListener('click', () => {
        if (audioCtx.state === 'suspended') audioCtx.resume();
        tocarNota(tecla.getAttribute('data-nota'));
    });
});

window.addEventListener('keydown', (evento) => {
    const teclaPressionada = evento.key.toLowerCase();
    const frequencia = mapeamentoTeclado[teclaPressionada];

    if (frequencia) {
        if (audioCtx.state === 'suspended') audioCtx.resume();
        tocarNota(frequencia);

        const botaoTela = document.querySelector(`[data-nota="${frequencia}"]`);
        if (botaoTela) {
            botaoTela.classList.add('ativa');
            setTimeout(() => botaoTela.classList.remove('ativa'), 100);
        }
    }
});