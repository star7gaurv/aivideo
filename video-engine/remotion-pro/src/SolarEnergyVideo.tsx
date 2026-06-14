import React from 'react';
import {
  Composition,
  Sequence,
  AbsoluteFill,
  useVideoConfig,
} from 'remotion';
import { theme } from './theme';
import { Title, AnimatedText } from './components/AnimatedText';
import { SceneBase, ContentGrid, Section } from './components/SceneBase';
import {
  Sun,
  SolarPanel,
  Photon,
  Electricity,
  Globe,
} from './components/SolarIllustrations';

// Scene 1: Title (4s)
const TitleScene: React.FC = () => (
  <SceneBase>
    <div style={{ textAlign: 'center' }}>
      <Title
        main="सौर ऊर्जा"
        subtitle="Solar Energy • शक्ति सूरज की"
        mainSize={theme.typography.sizes['4xl']}
        subtitleSize={theme.typography.sizes.xl}
        color={theme.colors.white}
      />
      <div style={{ marginTop: '40px', marginBottom: '-40px' }}>
        <Sun size={100} animated />
      </div>
    </div>
  </SceneBase>
);

// Scene 2: How it works (9s)
const HowItWorksScene: React.FC = () => (
  <SceneBase>
    <ContentGrid columns={2} gap={32}>
      <Section align="center">
        <Sun size={80} animated />
        <div style={{ marginTop: '20px' }}>
          <SolarPanel animated />
        </div>
      </Section>
      <Section align="left">
        <AnimatedText
          text="सोलर पैनल"
          fontSize={theme.typography.sizes.xl}
          fontWeight={theme.typography.weights.bold}
          color={theme.colors.white}
          delay={0}
          duration={30}
          animation="slideInRight"
        />
        <div style={{ marginTop: '12px' }}>
          <AnimatedText
            text="सूरज की किरणें पकड़ते हैं"
            fontSize={theme.typography.sizes.base}
            color={theme.colors.white}
            delay={20}
            duration={25}
            animation="fadeIn"
          />
        </div>
        <div style={{ marginTop: '16px' }}>
          <AnimatedText
            text="फोटॉन → सिलिकॉन → विद्युत"
            fontSize={theme.typography.sizes.lg}
            fontWeight={theme.typography.weights.semibold}
            color={theme.colors.solar.energy}
            delay={40}
            duration={30}
            animation="slideInRight"
          />
        </div>
      </Section>
    </ContentGrid>
  </SceneBase>
);

// Scene 3: Benefits (8s)
const BenefitsScene: React.FC = () => (
  <SceneBase>
    <Section align="center">
      <AnimatedText
        text="सौर ऊर्जा के फायदे"
        fontSize={theme.typography.sizes['3xl']}
        fontWeight={theme.typography.weights.bold}
        color={theme.colors.white}
        delay={0}
        duration={30}
      />

      <div
        style={{
          marginTop: '40px',
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '24px',
          maxWidth: '600px',
        }}
      >
        {[
          { emoji: '♻️', text: 'प्रदूषण मुक्त', delay: 30 },
          { emoji: '⚡', text: 'कभी ख़त्म न हो', delay: 50 },
          { emoji: '💰', text: 'बिजली बिल कम', delay: 70 },
          { emoji: '🌍', text: 'पृथ्वी बचाएं', delay: 90 },
        ].map((benefit, i) => (
          <div
            key={i}
            style={{
              padding: '16px',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              backdropFilter: 'blur(10px)',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>
              {benefit.emoji}
            </div>
            <AnimatedText
              text={benefit.text}
              fontSize={theme.typography.sizes.base}
              color={theme.colors.white}
              delay={benefit.delay}
              duration={20}
              animation="fadeIn"
            />
          </div>
        ))}
      </div>
    </Section>
  </SceneBase>
);

// Scene 4: India Stats (8s)
const StatsScene: React.FC = () => (
  <SceneBase>
    <ContentGrid columns={2} gap={40}>
      <Section align="center">
        <Globe animated />
      </Section>
      <Section align="left">
        <div>
          <AnimatedText
            text="भारत में सौर ऊर्जा"
            fontSize={theme.typography.sizes['2xl']}
            fontWeight={theme.typography.weights.bold}
            color={theme.colors.white}
            delay={0}
            duration={30}
            animation="slideInRight"
          />
          <div style={{ marginTop: '24px' }}>
            <AnimatedText
              text="160 GW"
              fontSize={theme.typography.sizes['2xl']}
              fontWeight={theme.typography.weights.bold}
              color={theme.colors.solar.sun}
              delay={30}
              duration={20}
              animation="scaleIn"
            />
            <AnimatedText
              text="वर्तमान क्षमता"
              fontSize={theme.typography.sizes.base}
              color={theme.colors.white}
              delay={35}
              duration={20}
              animation="fadeIn"
            />
          </div>
          <div style={{ marginTop: '20px' }}>
            <AnimatedText
              text="↓"
              fontSize={theme.typography.sizes.xl}
              color={theme.colors.solar.energy}
              delay={50}
            />
          </div>
          <div style={{ marginTop: '20px' }}>
            <AnimatedText
              text="500 GW"
              fontSize={theme.typography.sizes['2xl']}
              fontWeight={theme.typography.weights.bold}
              color={theme.colors.solar.energy}
              delay={60}
              duration={20}
              animation="scaleIn"
            />
            <AnimatedText
              text="2030 तक लक्ष्य"
              fontSize={theme.typography.sizes.base}
              color={theme.colors.white}
              delay={65}
              duration={20}
              animation="fadeIn"
            />
          </div>
        </div>
      </Section>
    </ContentGrid>
  </SceneBase>
);

// Scene 5: Call to Action (5s)
const ActionScene: React.FC = () => (
  <SceneBase>
    <Section align="center">
      <div style={{ marginBottom: '32px' }}>
        <Electricity animated />
      </div>
      <AnimatedText
        text="आज ही शुरुआत करो"
        fontSize={theme.typography.sizes['3xl']}
        fontWeight={theme.typography.weights.bold}
        color={theme.colors.solar.sun}
        delay={0}
        duration={30}
        animation="scaleIn"
      />
      <div style={{ marginTop: '16px' }}>
        <AnimatedText
          text="सूरज की शक्ति से बनाओ स्वच्छ भविष्य"
          fontSize={theme.typography.sizes.lg}
          color={theme.colors.white}
          delay={30}
          duration={25}
          animation="fadeIn"
        />
      </div>
    </Section>
  </SceneBase>
);

// Main composition
export const SolarEnergyVideo: React.FC = () => {
  return (
    <AbsoluteFill>
      {/* Scene 1: Title (0-120 frames = 4s @ 30fps) */}
      <Sequence from={0} durationInFrames={120}>
        <TitleScene />
      </Sequence>

      {/* Scene 2: How it works (120-390 frames = 9s) */}
      <Sequence from={120} durationInFrames={270}>
        <HowItWorksScene />
      </Sequence>

      {/* Scene 3: Benefits (390-630 frames = 8s) */}
      <Sequence from={390} durationInFrames={240}>
        <BenefitsScene />
      </Sequence>

      {/* Scene 4: Stats (630-870 frames = 8s) */}
      <Sequence from={630} durationInFrames={240}>
        <StatsScene />
      </Sequence>

      {/* Scene 5: Action (870-1020 frames = 5s) */}
      <Sequence from={870} durationInFrames={150}>
        <ActionScene />
      </Sequence>
    </AbsoluteFill>
  );
};

// Remotion composition registration
export default [
  new Composition({
    id: 'SolarEnergy',
    component: SolarEnergyVideo,
    durationInFrames: 1020, // 34 seconds @ 30fps
    fps: 30,
    width: 1920,
    height: 1080,
  }),
];
