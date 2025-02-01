import React from 'react';
import CustomPicker from '../common/CustomPicker';

const VersePicker = ({ 
  label,
  selectedVerse, 
  onVerseSelect, 
  verses, 
  enabled,
  isLoading 
}) => {
  const verseItems = verses.map(verse => ({
    label: verse.number.toString(),
    value: verse.number.toString()
  }));

  return (
    <CustomPicker
      label={label}
      selectedValue={selectedVerse}
      onValueChange={onVerseSelect}
      items={verseItems}
      enabled={enabled && !isLoading}
      placeholder="Selecione"
    />
  );
};

export default VersePicker;
