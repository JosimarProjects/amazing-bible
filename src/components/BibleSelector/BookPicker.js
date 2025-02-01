import React from 'react';
import CustomPicker from '../common/CustomPicker';

const BookPicker = ({ 
  selectedBook, 
  onBookSelect, 
  books, 
  isLoading 
}) => {
  const bookItems = books.map(book => ({
    label: book.name,
    value: book.abbrev.pt
  }));

  return (
    <CustomPicker
      label="Livro:"
      selectedValue={selectedBook}
      onValueChange={(itemValue, itemIndex) => {
        if (itemIndex > 0) {
          const selectedBook = books[itemIndex - 1];
          onBookSelect(itemValue, selectedBook);
        } else {
          onBookSelect("", null);
        }
      }}
      items={bookItems}
      enabled={!isLoading}
      placeholder="Selecione o Livro"
    />
  );
};

export default BookPicker;
