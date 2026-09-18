import Svg, { Circle, Path, Rect } from 'react-native-svg';

type QuickLogIconId =
  | 'logTraining'
  | 'logTechnique'
  | 'logCompetition'
  | 'addNote';

interface QuickLogIconProps {
  id: QuickLogIconId;
  color: string;
  size?: number;
}

/**
 * My Gi line icons — bronze stroke, mat / belt / medal language.
 */
export function QuickLogIcon({ id, color, size = 22 }: QuickLogIconProps) {
  switch (id) {
    case 'logTraining':
      return <TrainingMatIcon color={color} size={size} />;
    case 'logTechnique':
      return <TechniqueFlowIcon color={color} size={size} />;
    case 'logCompetition':
      return <CompetitionMedalIcon color={color} size={size} />;
    case 'addNote':
      return <MatNoteIcon color={color} size={size} />;
    default:
      return null;
  }
}

function TrainingMatIcon({ color, size }: { color: string; size: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Tatami plate */}
      <Rect
        x="3.5"
        y="5"
        width="17"
        height="14"
        rx="2"
        stroke={color}
        strokeWidth={1.6}
      />
      <Path
        d="M3.5 10.5H20.5M3.5 14.5H20.5M9 5V19M15 5V19"
        stroke={color}
        strokeWidth={1.2}
        opacity={0.45}
      />
      {/* Belt knot */}
      <Path
        d="M8 12.2H16"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
      />
      <Path
        d="M10.8 10.6L13.2 13.8M13.2 10.6L10.8 13.8"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
      />
    </Svg>
  );
}

function TechniqueFlowIcon({ color, size }: { color: string; size: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Geometric technique diagram */}
      <Path
        d="M12 3.5L20 8.5V15.5L12 20.5L4 15.5V8.5L12 3.5Z"
        stroke={color}
        strokeWidth={1.6}
        strokeLinejoin="round"
      />
      <Path
        d="M12 3.5V12M12 12L20 8.5M12 12L4 8.5M12 12V20.5"
        stroke={color}
        strokeWidth={1.25}
        opacity={0.55}
        strokeLinejoin="round"
      />
      <Circle cx="12" cy="12" r="1.6" fill={color} />
    </Svg>
  );
}

function CompetitionMedalIcon({ color, size }: { color: string; size: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Ribbon */}
      <Path
        d="M8.5 3.5L12 9L15.5 3.5"
        stroke={color}
        strokeWidth={1.6}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <Path
        d="M9.2 3.5H14.8"
        stroke={color}
        strokeWidth={1.6}
        strokeLinecap="round"
      />
      {/* Medal face */}
      <Circle cx="12" cy="15" r="5.2" stroke={color} strokeWidth={1.6} />
      <Circle cx="12" cy="15" r="2.4" stroke={color} strokeWidth={1.35} />
    </Svg>
  );
}

function MatNoteIcon({ color, size }: { color: string; size: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M7 3.5H14.5L19 8V20.5H7C6.2 20.5 5.5 19.8 5.5 19V5C5.5 4.2 6.2 3.5 7 3.5Z"
        stroke={color}
        strokeWidth={1.6}
        strokeLinejoin="round"
      />
      <Path
        d="M14.5 3.5V8H19"
        stroke={color}
        strokeWidth={1.6}
        strokeLinejoin="round"
      />
      <Path
        d="M9 12H15.5M9 15.5H13.5"
        stroke={color}
        strokeWidth={1.4}
        strokeLinecap="round"
        opacity={0.7}
      />
    </Svg>
  );
}
