import React from 'react';

const EARNING_COLOR = '#81ecec';
const EXPENSE_COLOR = '#ff7675';

export default function ListScreen({
  transactions,
  periods,
  currentPeriod,
  filteredText,
  onDeleteTransaction,
  onEditTransaction,
  onFilterChange,
  onPeriodChange,
  onNewTransaction,
}) {
  return (
    <>
      <select
        className="browser-default"
        value={currentPeriod}
        onChange={onPeriodChange}
      >
        {periods.map((period) => {
          return <option key={period}>{period}</option>;
        })}
      </select>

      <input
        type="text"
        placeholder="Filtro..."
        value={filteredText}
        onChange={onFilterChange}
        style={{ marginTop: '20px', marginBottom: '20px' }}
      />

      <div style={{ marginTop: '20px', marginBottom: '20px' }}>
        <button
          className="waves-effect waves-light btn"
          onClick={onNewTransaction}
        >
          Novo Lançamento
        </button>
      </div>

      {transactions.map((transaction) => {
        const currentColor =
          transaction.type === '+' ? EARNING_COLOR : EXPENSE_COLOR;
        return (
          <div
            key={transaction._id}
            style={{
              ...styles.transactionStyle,
              backgroundColor: currentColor,
            }}
          >
            <span style={styles.buttonStyle}>
              <button
                className="waves-effect waves-light btn"
                onClick={onEditTransaction}
                id={transaction._id}
              >
                Editar
              </button>

              <button
                style={{ marginLeft: '10x' }}
                className="waves-effect waves-light btn red darken-4"
                onClick={onDeleteTransaction}
                id={transaction._id}
              >
                x
              </button>
            </span>

            <span>
              {transaction.yearMonthDay} -{' '}
              <strong style={{ fontWeight: 'bolder' }}>
                {transaction.category}
              </strong>{' '}
              - {transaction.description} - {transaction.value}
            </span>
          </div>
        );
      })}
    </>
  );
}

const styles = {
  transactionStyle: {
    padding: '5px',
    margin: '5px',
    border: '1px solid lightgray',
    borderRadius: '5px',
  },
  buttonStyle: {
    margin: '10px',
  },
};
