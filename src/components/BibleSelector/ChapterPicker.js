import React from 'react';
import CustomPicker from '../common/CustomPicker';

const ChapterPicker = ({ 
  selectedChapter, 
  onChapterSelect, 
  chapters, 
  enabled 
}) => {
  const chapterItems = chapters.map(chapter => ({
    label: chapter,
    value: chapter
  }));

  return (
    <CustomPicker
      label="Capítulo:"
      selectedValue={selectedChapter}
      onValueChange={onChapterSelect}
      items={chapterItems}
      enabled={enabled}
      placeholder="Selecione o Capítulo"
    />
  );
};

export default ChapterPicker;
