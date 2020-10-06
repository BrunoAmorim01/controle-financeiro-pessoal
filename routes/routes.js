import { Router } from 'express';
import {
  postTransaction,
  updateTransaction,
  deleteTransaction,
  getTransactionsFrom,
} from '../services/transactionService.js';
import dateHelpers from '../helpers/dateHelper.js';

const transactionRouter = Router();

transactionRouter.get('/', async (request, response) => {
  const { query } = request;

  try {
    if (!query.period) {
      throw new Error(
        'É necessário informar o parâmetro "period", cujo valor deve estar no formato yyyy-mm'
      );
    }

    const { period } = query;
    dateHelpers.validatePeriod(period);

    const filteredTransactions = await getTransactionsFrom(period);

    response.send({
      length: filteredTransactions.length,
      transactions: filteredTransactions,
    });
  } catch ({ message }) {
    console.log(message);
    response.status(400).send({ error: message });
  }
});

transactionRouter.post('/', async (request, response) => {
  const { body } = request;

  try {
    await validateTransactionData(body);

    const { description, value, category, year, month, day, type } = body;
    const period = dateHelpers.createPeriodFrom(year, month);

    const newPostTransaction = {
      description,
      value,
      category,
      year,
      month,
      day,
      yearMonth: period,
      yearMonthDay: dateHelpers.createDateFrom(year, month, day),
      type,
    };

    const newTransaction = await postTransaction(newPostTransaction);

    response.send({
      status: 'ok',
      transaction: newTransaction,
    });
  } catch ({ message }) {
    console.log(message);

    response.status(400).send({ error: message });
  }
});

transactionRouter.put('/:id', async (request, response) => {
  const { body, params } = request;

  try {
    await validateTransactionId(params);
    await validateTransactionData(body);

    const { description, value, category, year, month, day, type } = body;
    const { id } = params;

    const period = dateHelpers.createPeriodFrom(year, month);

    const updateTransactionModel = {
      description,
      value,
      category,
      year,
      month,
      day,
      yearMonth: period,
      yearMonthDay: dateHelpers.createDateFrom(year, month, day),
      type,
    };

    const updatedTransaction = await updateTransaction(
      id,
      updateTransactionModel
    );

    response.send({
      status: 'ok',
      transaction: updatedTransaction,
    });
  } catch ({ message }) {
    console.log(message);
    response.status(400).send({ error: message });
  }
});

transactionRouter.delete('/:id', async (request, response) => {
  const { params } = request;

  try {
    await validateTransactionId(params);
    const { id } = params;
    const didDelete = await deleteTransaction(id);

    if (didDelete) {
      response.send({
        status: 'ok',
        message: `Lançamento de id ${id} excluido com sucesso`,
      });
    } else {
      throw new Error('Não foi possível excluir');
    }
  } catch ({ message }) {
    console.log(message);
    response.status(400).send({ error: message });
  }
});

async function validateTransactionData(body) {
  const { description, value, category, year, month, day, type } = body;

  if (!description || description.trim() === '') {
    throw new Error('A descrição é obrigatória');
  }

  if (!value || value < 0) {
    throw new Error('O valor é obrigatório.');
  }

  if (!category || category.trim() === '') {
    throw new Error('A categoria é obrigatória.');
  }

  if (!year || year.toString().trim() === '') {
    throw new Error('O ano é obrigatório.');
  }

  if (!month || month.toString() === '') {
    throw new Error('O mês é obrigatório.');
  }

  if (!day || day.toString() === '') {
    throw new Error('O dia é obrigatório.');
  }

  if (!type || type.toString() === '') {
    throw new Error('O tipo de lançamento é obrigatório.');
  }

  if (value < 0) {
    throw new Error('O valor deve ser maior ou igual a 0.');
  }

  const period = dateHelpers.createPeriodFrom(year, month);
  dateHelpers.validatePeriod(period);
  dateHelpers.validateDay(day, month, year);

  if (type.trim() !== '+' && type.trim() !== '-') {
    throw new Error(
      `Tipo de lançamento inválido (${type}) - A propriedade 'type' deve ter o valor '+' ou '-'`
    );
  }
}

async function validateTransactionId(params) {
  if (!params.id) {
    throw new Error('É necessário informar o id do lançamento');
  }
}

export default transactionRouter;
