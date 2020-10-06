import React, { useEffect, useState } from 'react';

const INSERTING = 0;
const EDITING = 1;

function today() {
  const date = new Date();
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, 0);
  const day = date.getDay().toString().padStart(2, 0);

  const today = `${year}-${month}-${day}`;

  return today;
}

export default function MaintenanceScreen({ transaction, onCancel, onSave }) {
  const [description, setDescription] = useState('Nova descrição');
  const [value, setValue] = useState(100);
  const [category, setCategory] = useState('Nova categoria');
  const [date, setDate] = useState(today());
  const [type, setType] = useState('-');
  const [mode, setMode] = useState(INSERTING);

  useEffect(() => {
    if (!transaction) {
      return;
    }

    const { description, value, category, yearMonthDay, type } = transaction;

    setDescription(description);
    setValue(value);
    setCategory(category);
    setDate(yearMonthDay);
    setType(type);
    setMode(EDITING);
  }, [transaction]);

  const handleDescriptionChange = (event) => {
    const newDescription = event.target.value.trim();
    setDescription(newDescription);
  };

  const handleValueChange = (event) => {
    const newValue = Number(event.target.value);
    setValue(newValue);
  };

  const handleCategoryChange = (event) => {
    const newCategory = event.target.value.trim();
    setCategory(newCategory);
  };

  const handleDateChange = (event) => {
    const newDate = event.target.value.trim();
    setDate(newDate);
  };

  const handleTypeChange = (event) => {
    const newType = event.target.value;
    setType(newType);
  };

  const handleCancelClick = () => {
    onCancel();
  };

  const handleSaveClick = () => {
    const newTransaction = {
      _id: !!transaction ? transaction._id : null,
      description,
      value,
      type,
      category,
      yearMonthDay: date,
    };
    onSave(newTransaction);
  };

  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <span>
          <label>
            <input
              name="expense_earning"
              type="radio"
              checked={type === '-'}
              value="-"
              onChange={handleTypeChange}
            />
            <span>Despesa</span>
          </label>
        </span>

        <span style={{ marginLeft: '30px' }}>
          <label>
            <input
              name="expense_earning"
              type="radio"
              checked={type === '+'}
              value="+"
              onChange={handleTypeChange}
            />
            <span>Receita</span>
          </label>
        </span>
      </div>

      <div className="input-field">
        <input
          id="inputDescription"
          type="text"
          value={description}
          onChange={handleDescriptionChange}
        />
        <label className="active" htmlFor="inputDescription">
          Descrição
        </label>
      </div>

      <div className="input-field">
        <input
          id="inputValue"
          type="number"
          value={value}
          onChange={handleValueChange}
        />
        <label className="active" htmlFor="inputValue">
          Valor
        </label>
      </div>

      <div className="input-field">
        <input
          id="inputCategory"
          type="text"
          value={category}
          onChange={handleCategoryChange}
        />
        <label className="active" htmlFor="inputCategory">
          Categoria
        </label>
      </div>

      <div className="input-field">
        <input
          id="inputDate"
          type="date"
          value={date}
          onChange={handleDateChange}
        />
        <label className="active" htmlFor="inputDate">
          Data
        </label>
      </div>
      <button
        className="waves-effect waves-light btn"
        onClick={handleSaveClick}
      >
        Salvar
      </button>
      <button
        style={{ marginLeft: '10px' }}
        className="waves-effect waves-light btn red darken-4"
        onClick={handleCancelClick}
      >
        Cancelar
      </button>
    </div>
  );
}
