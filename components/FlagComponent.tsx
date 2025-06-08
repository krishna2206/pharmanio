import React from 'react';
import { ClipPath, Defs, Path, Rect, Svg } from 'react-native-svg';

interface FlagProps {
  size?: number;
}

export function EnglishFlag({ size = 32 }: FlagProps) {
  return (
    <Svg width={size} height={size * 0.6} viewBox="0 0 60 36">
      <Defs>
        <ClipPath id="roundedCorners">
          <Rect width="60" height="36" rx="4" ry="4" />
        </ClipPath>
      </Defs>
      <Rect width="60" height="36" fill="#012169" clipPath="url(#roundedCorners)" />
      <Path d="M0,0 L60,36 M60,0 L0,36" stroke="white" strokeWidth="4" clipPath="url(#roundedCorners)" />
      <Path d="M0,0 L60,36 M60,0 L0,36" stroke="#C8102E" strokeWidth="2.4" clipPath="url(#roundedCorners)" />
      <Path d="M30,0 L30,36 M0,18 L60,18" stroke="white" strokeWidth="6" clipPath="url(#roundedCorners)" />
      <Path d="M30,0 L30,36 M0,18 L60,18" stroke="#C8102E" strokeWidth="3.6" clipPath="url(#roundedCorners)" />
    </Svg>
  );
}

export function FrenchFlag({ size = 32 }: FlagProps) {
  return (
    <Svg width={size} height={size * 0.67} viewBox="0 0 45 30">
      <Defs>
        <ClipPath id="frenchRoundedCorners">
          <Rect width="45" height="30" rx="4" ry="4" />
        </ClipPath>
      </Defs>
      <Rect x="0" y="0" width="15" height="30" fill="#0055A4" clipPath="url(#frenchRoundedCorners)" />
      <Rect x="15" y="0" width="15" height="30" fill="#FFFFFF" clipPath="url(#frenchRoundedCorners)" />
      <Rect x="30" y="0" width="15" height="30" fill="#EF4135" clipPath="url(#frenchRoundedCorners)" />
    </Svg>
  );
}

export function MalagasyFlag({ size = 32 }: FlagProps) {
  return (
    <Svg width={size} height={size * 0.67} viewBox="0 0 45 30">
      <Defs>
        <ClipPath id="malagasyRoundedCorners">
          <Rect width="45" height="30" rx="4" ry="4" />
        </ClipPath>
      </Defs>
      <Rect x="0" y="0" width="15" height="30" fill="#FFFFFF" clipPath="url(#malagasyRoundedCorners)" />
      <Rect x="15" y="0" width="30" height="15" fill="#e84f3f" clipPath="url(#malagasyRoundedCorners)" />
      <Rect x="15" y="15" width="30" height="15" fill="#367c41" clipPath="url(#malagasyRoundedCorners)" />
    </Svg>
  );
}