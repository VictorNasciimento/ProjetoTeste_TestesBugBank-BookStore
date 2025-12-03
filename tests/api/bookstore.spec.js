// tests/api/bookstore.spec.js
const { test, expect } = require('@playwright/test');

test.describe('Desafio 1: API BookStore', () => {
  // Coloca um tempo limite padrão de 30s
  test.setTimeout(30000);


  // Função que cria um usuário novo pra não dar erro de duplicidade, assim garantimos que cada teste tenha seu próprio usuário
  const criarDadosUsuario = () => {
    const randomId = Date.now() + Math.floor(Math.random() * 1000);
    return {
      userName: `AlunoQA${randomId}`,
      password: 'Password@123!' // Senha fixa
    };
  };

  test('1. Criar Usuário (POST)', async ({ request }) => {
    const user = criarDadosUsuario();
    
    const response = await request.post('https://bookstore.toolsqa.com/Account/v1/User', {
      data: user
    });
    
    console.log(`Criar Usuário: Status ${response.status()}`);
    expect(response.status()).toBe(201);
  });

  test('2. Gerar Token (POST)', async ({ request }) => {
    // Tive que criar o usuário aqui de novo pq a API as vezes falha
    // e diz que o usuário do teste anterior não existe.
    // Criando aqui dentro, o teste não quebra.
    const user = criarDadosUsuario();

    // 1. Cria o usuário mais rapido
    await request.post('https://bookstore.toolsqa.com/Account/v1/User', { data: user });

    // 2. Tenta gerar o token na mesma hora, imediata
    const response = await request.post('https://bookstore.toolsqa.com/Account/v1/GenerateToken', {
      data: user
    });

    const body = await response.json();
    
    if (body.status !== "Success") {
      console.log("Erro Token:", body);
    }

    expect(response.status()).toBe(200);
    expect(body.status).toBe("Success");
  });

  test('3. Listar Livros (GET)', async ({ request }) => {
    const response = await request.get('https://bookstore.toolsqa.com/BookStore/v1/Books');
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.books.length).toBeGreaterThan(0);
  });
});