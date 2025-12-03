// tests/e2e/bugbank.spec.js
const { test, expect } = require('@playwright/test');

test.describe('Desafio 2: E2E BugBank', () => {
  test.setTimeout(120000);

  const randomId = Math.floor(Math.random() * 1000);
  const email = `teste${randomId}@gmail.com`;
  const nome = `Aluno QA ${randomId}`;
  const senha = '123';

  test('Fluxo Completo: Cadastro e Login com Saldo', async ({ page }) => {
    // 1. Acessar
    await page.goto('https://bugbank.netlify.app/');

    // 2. Cadastro
    await page.getByRole('button', { name: 'Registrar' }).click({ force: true });
    
    await page.locator('input[type="email"]').nth(1).fill(email);
    await page.locator('input[name="name"]').fill(nome);
    await page.locator('input[type="password"]').nth(1).fill(senha);
    await page.locator('input[name="passwordConfirmation"]').fill(senha);

    // Saldo: Espera 1s e clica (Garante o Saldo 1000) para funcionar
    await page.waitForTimeout(1000);
    await page.locator('#toggleAddBalance').click({ force: true });

    await page.getByRole('button', { name: 'Cadastrar' }).click({ force: true });

    const modalText = page.locator('#modalText');
    await expect(modalText).toContainText('criada com sucesso', { timeout: 60000 });
    
    const btnFechar = page.locator('#btnCloseModal');
    await btnFechar.scrollIntoViewIfNeeded(); 
    await btnFechar.click({ force: true });

    // Espera o modal sumir totalmente (Segurança para o Safari)
    await page.waitForTimeout(2000);

    // 3. Login
    await page.locator('input[type="email"]').first().fill(email);
    
    
    // para o site apertar enter ao invés de clicar, pois pode demorar e quebrar o codigo clicando, o enter é melhor.
    await page.locator('input[type="password"]').first().fill(senha);
    await page.keyboard.press('Enter'); 
    
    // utilizando o force: true para forçar, pq as vezes não clicava
    await page.getByRole('button', { name: 'Acessar' }).click({ force: true });

    // Espera a Home carregar
    await page.waitForTimeout(5000);

    // 4. Validações
    await expect(page.locator('#textName')).toContainText(nome, { timeout: 30000 });
    
    const elementoSaldo = page.locator('#textBalance span');
    await expect(elementoSaldo).toBeVisible();
    
    const textoSaldo = await elementoSaldo.textContent();
    
    // Limpeza para aceitar tudo e passar limpo o saldo
    const saldoLimpo = textoSaldo.replace(/[^\d,]/g, '').replace(',', '.');
    const valorNumerico = parseFloat(saldoLimpo);
    
    console.log(`Saldo Final: ${valorNumerico}`);
    expect(valorNumerico).toBeGreaterThan(0);
  });
});