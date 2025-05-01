((a, b) => {
    const App = {
        htmlElements: {
            resp1: document.querySelector('#resp1'),
            resp2: document.querySelector('#resp2'),
            resp3: document.querySelector('#resp3'),
            resp4: document.querySelector('#resp4'),
            btnPalindromo: document.querySelector('#btnPalindromo'),
            btnContar: document.querySelector('#btnContar'),
            btnBisiesto: document.querySelector('#btnBisiesto'),
            btnPrimos: document.querySelector('#btnPrimos'),
        },

        init: () => {
            App.htmlElements.btnPalindromo.addEventListener('click', App.methods.resp1);
            App.htmlElements.btnContar.addEventListener('click', App.methods.resp2);
            App.htmlElements.btnBisiesto.addEventListener('click', App.methods.resp3);
            App.htmlElements.btnPrimos.addEventListener('click', App.methods.resp4);
        },

        methods: {
            resp1: () => {
                const input = document.querySelector('#inputPalindromo').value;
                const n = parseInt(input);
                if (isNaN(n)) {
                    App.methods.print(App.htmlElements.resp1, "No es un número válido");
                    return;
                }

                const base10 = input === input.split('').reverse().join('');
                const base2 = n.toString(2);
                const base2Pal = base2 === base2.split('').reverse().join('');
                const resultado = base10 && base2Pal
                    ? "Es palíndromo en base 10 y base 2"
                    : "No lo es";

                App.methods.print(App.htmlElements.resp1, resultado);
            },

            resp2: () => {
                const texto = document.querySelector('#inputContador').value;
                const contador = {};
                for (let char of texto) {
                    contador[char] = (contador[char] || 0) + 1;
                }

                let salida = "";
                for (let letra in contador) {
                    salida += `${letra}: ${contador[letra]}\n`;
                }

                App.methods.print(App.htmlElements.resp2, salida);
            },

            resp3: () => {
                const anio = parseInt(document.querySelector('#inputAnio').value);
                const bisiesto = (anio % 4 === 0 && anio % 100 !== 0) || (anio % 400 === 0);
                App.methods.print(App.htmlElements.resp3, bisiesto ? "Es bisiesto" : "No es bisiesto");
            },

            resp4: () => {
                const n = parseInt(document.querySelector('#inputPrimos').value);
                if (isNaN(n) || n >= 1000000) {
                    App.methods.print(App.htmlElements.resp4, "Número inválido o muy grande");
                    return;
                }

                const primos = Array(n + 1).fill(true);
                primos[0] = primos[1] = false;

                for (let i = 2; i * i <= n; i++) {
                    if (primos[i]) {
                        for (let j = i * i; j <= n; j += i) {
                            primos[j] = false;
                        }
                    }
                }

                const suma = primos.reduce((acc, esPrimo, idx) => esPrimo ? acc + idx : acc, 0);
                App.methods.print(App.htmlElements.resp4, `Suma: ${suma}`);
            },

            print: (element, value) => {
                element.textContent = value;
            }
        }
    };

    App.init();
})();
