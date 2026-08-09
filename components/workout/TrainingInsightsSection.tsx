import { StyleSheet, View } from 'react-native';

import { spacing } from '../../lib/theme';
import type { TrainingInsights } from '../../types/trainingInsights';
import { Spacer } from '../ui/Spacer';
import { Text } from '../ui/Text';
import { TrainingIntensityCard } from './TrainingIntensityCard';
import { TrainingPartnersCard } from './TrainingPartnersCard';
import { YourGameCard } from './YourGameCard';

interface TrainingInsightsSectionProps {
  insights: TrainingInsights;
  onLogTraining?: () => void;
  onViewAllTechniques?: () => void;
  onTechniquePress?: (techniqueId: string) => void;
}

export function TrainingInsightsSection({
  insights,
  onLogTraining,
  onViewAllTechniques,
  onTechniquePress,
}: TrainingInsightsSectionProps) {
  return (
    <View style={styles.section}>
      <Text variant="caption" muted style={styles.sectionLabel}>
        TRAINING INSIGHTS
      </Text>
      <Spacer size="sm" />
      <TrainingIntensityCard
        insight={insights.intensity}
        onLogTraining={onLogTraining}
      />
      <Spacer size="md" />
      <TrainingPartnersCard
        insight={insights.partners}
        onLogTraining={onLogTraining}
      />
      <Spacer size="md" />
      <YourGameCard
        insight={insights.techniques}
        onLogTraining={onLogTraining}
        onViewAll={onViewAllTechniques}
        onTechniquePress={onTechniquePress}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    width: '100%',
  },
  sectionLabel: {
    letterSpacing: 1.1,
  },
});
