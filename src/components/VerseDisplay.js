import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import { theme } from '../theme';
import { images } from '../theme/images';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const VerseDisplay = ({ verses, onBack }) => {
  return (
    <View style={styles.mainContainer}>
      <ImageBackground 
        source={{ uri: images.backgrounds.parchment }}
        style={styles.background}
        resizeMode="cover"
      >
        <View style={styles.overlay}>
          <View style={styles.container}>
            <View style={styles.header}>
              <Icon name="book-cross" size={40} color={theme.colors.primary} style={styles.headerIcon} />
              <Text style={styles.title}>Versículos Selecionados</Text>
            </View>

            <ScrollView style={styles.scrollView}>
              <View style={styles.content}>
                {verses.map((verse) => (
                  <View key={verse.number} style={styles.verseContainer}>
                    <View style={styles.verseHeader}>
                      <Icon name="bookmark" size={20} color={theme.colors.primary} />
                      <Text style={styles.verseNumber}>{verse.number}</Text>
                    </View>
                    <Text style={styles.verseText}>{verse.text}</Text>
                  </View>
                ))}
              </View>
            </ScrollView>

            <TouchableOpacity 
              style={styles.backButton} 
              onPress={onBack}
            >
              <Icon name="arrow-left" size={24} color={theme.colors.background} />
              <Text style={styles.backButtonText}>Voltar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  background: {
    flex: 1,
    width: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.97)',
  },
  container: {
    flex: 1,
    padding: theme.spacing.lg,
  },
  header: {
    alignItems: 'center',
    marginVertical: theme.spacing.xl,
  },
  headerIcon: {
    marginBottom: theme.spacing.sm,
  },
  title: {
    fontSize: 24,
    fontFamily: theme.fonts.bold,
    color: theme.colors.primary,
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingBottom: theme.spacing.xl,
  },
  verseContainer: {
    backgroundColor: theme.colors.background,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.md,
    ...theme.shadows.light,
  },
  verseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  verseNumber: {
    fontFamily: theme.fonts.bold,
    fontSize: 16,
    color: theme.colors.primary,
    marginLeft: theme.spacing.sm,
  },
  verseText: {
    fontFamily: theme.fonts.regular,
    fontSize: 16,
    lineHeight: 24,
    color: theme.colors.text,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginTop: theme.spacing.lg,
    ...theme.shadows.medium,
  },
  backButtonText: {
    color: theme.colors.background,
    fontSize: 16,
    fontFamily: theme.fonts.medium,
    marginLeft: theme.spacing.sm,
  },
});

export default VerseDisplay;
