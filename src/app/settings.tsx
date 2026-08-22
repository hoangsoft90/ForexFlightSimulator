import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useI18n } from '@/i18n/context';
import { useTraderStore } from '@/store/trader-store';
import { colors, spacing, font, radius } from '@/constants/theme';
import {
  IconArrowLeft,
  IconLanguage,
  IconRefresh,
  IconInfoCircle,
  IconDatabase,
  IconCheck,
} from '@tabler/icons-react-native';
import { AdBanner } from '@/components/ad-banner';

export default function SettingsScreen() {
  const { lang, setLang, t } = useI18n();
  const { reset, sessionsCompleted, completedPacks } = useTraderStore();
  const insets = useSafeAreaInsets();
  const [resetDone, setResetDone] = useState(false);

  const handleReset = () => {
    Alert.alert(
      '',
      t('settings.resetConfirm'),
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            reset();
            setResetDone(true);
            setTimeout(() => setResetDone(false), 2000);
          },
        },
      ],
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + spacing.md, paddingBottom: insets.bottom + 72 },
        ]}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <IconArrowLeft size={22} color={colors.text} strokeWidth={2} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t('settings.title')}</Text>
          <View style={{ width: 36 }} />
        </View>

        {/* ── Language ─────────────────────────────────────────────── */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <IconLanguage size={18} color={colors.primary} strokeWidth={1.5} />
            <Text style={styles.sectionTitle}>{t('settings.language')}</Text>
          </View>
          <Text style={styles.sectionDesc}>{t('settings.languageDesc')}</Text>
          <View style={styles.langRow}>
            {(['en', 'vi'] as const).map((l) => (
              <TouchableOpacity
                key={l}
                style={[styles.langBtn, lang === l && styles.langBtnActive]}
                onPress={() => setLang(l)}
                activeOpacity={0.7}
              >
                <Text style={[styles.langFlag, lang === l && styles.langFlagActive]}>
                  {l === 'en' ? '🇬🇧' : '🇻🇳'}
                </Text>
                <Text style={[styles.langLabel, lang === l && styles.langLabelActive]}>
                  {l === 'en' ? 'English' : 'Tiếng Việt'}
                </Text>
                {lang === l && (
                  <IconCheck size={16} color={colors.primary} strokeWidth={2.5} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* ── Reset ────────────────────────────────────────────────── */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <IconRefresh size={18} color={colors.red} strokeWidth={1.5} />
            <Text style={[styles.sectionTitle, { color: colors.red }]}>
              {t('settings.resetScores')}
            </Text>
          </View>
          <Text style={styles.sectionDesc}>{t('settings.resetScoresDesc')}</Text>
          {resetDone ? (
            <View style={styles.resetDone}>
              <IconCheck size={16} color={colors.green} strokeWidth={2.5} />
              <Text style={styles.resetDoneText}>{t('settings.resetDone')}</Text>
            </View>
          ) : (
            <TouchableOpacity style={styles.resetBtn} onPress={handleReset} activeOpacity={0.7}>
              <Text style={styles.resetBtnText}>{t('settings.resetScores')}</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* ── Data ─────────────────────────────────────────────────── */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <IconDatabase size={18} color={colors.textSecondary} strokeWidth={1.5} />
            <Text style={styles.sectionTitle}>{t('settings.dataStorage')}</Text>
          </View>
          <Text style={styles.sectionDesc}>{t('settings.dataStorageDesc')}</Text>
          <View style={styles.dataRow}>
            <Text style={styles.dataLabel}>{t('home.sessionsCompleted').replace('{count}', '').trim()}</Text>
            <Text style={styles.dataValue}>{sessionsCompleted}</Text>
          </View>
          <View style={styles.dataRow}>
            <Text style={styles.dataLabel}>Packs completed</Text>
            <Text style={styles.dataValue}>{completedPacks.length}</Text>
          </View>
        </View>

        {/* ── About ────────────────────────────────────────────────── */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <IconInfoCircle size={18} color={colors.textSecondary} strokeWidth={1.5} />
            <Text style={styles.sectionTitle}>{t('settings.about')}</Text>
          </View>
          <Text style={styles.aboutName}>{t('settings.appName')}</Text>
          <Text style={styles.aboutDesc}>{t('settings.description')}</Text>
          <View style={styles.dataRow}>
            <Text style={styles.dataLabel}>{t('settings.version')}</Text>
            <Text style={styles.dataValue}>1.0.0</Text>
          </View>
        </View>
      </ScrollView>

      {/* Fixed ad banner */}
      <AdBanner />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  content: {
    padding: spacing.xl,
    gap: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  headerTitle: {
    fontSize: font.lg,
    fontWeight: '600',
    color: colors.text,
  },
  section: {
    backgroundColor: colors.surface,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.borderLight,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  sectionTitle: {
    fontSize: font.md,
    fontWeight: '600',
    color: colors.text,
  },
  sectionDesc: {
    fontSize: font.sm,
    color: colors.textMuted,
    lineHeight: 18,
  },
  langRow: {
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  langBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.bg,
  },
  langBtnActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  langFlag: {
    fontSize: 22,
  },
  langFlagActive: {},
  langLabel: {
    flex: 1,
    fontSize: font.md,
    color: colors.text,
  },
  langLabelActive: {
    fontWeight: '600',
    color: colors.primary,
  },
  resetBtn: {
    backgroundColor: colors.redLight,
    paddingVertical: spacing.md,
    borderRadius: radius.sm,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.red + '30',
    marginTop: spacing.xs,
  },
  resetBtnText: {
    color: colors.red,
    fontSize: font.sm,
    fontWeight: '500',
  },
  resetDone: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
  },
  resetDoneText: {
    color: colors.green,
    fontSize: font.sm,
    fontWeight: '500',
  },
  dataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.xs,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  dataLabel: {
    fontSize: font.sm,
    color: colors.textSecondary,
  },
  dataValue: {
    fontSize: font.sm,
    fontWeight: '600',
    color: colors.text,
  },
  aboutName: {
    fontSize: font.lg,
    fontWeight: '600',
    color: colors.text,
  },
  aboutDesc: {
    fontSize: font.sm,
    color: colors.textSecondary,
    lineHeight: 18,
  },
});
