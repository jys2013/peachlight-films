import React from "react";
import {
  AbsoluteFill, Composition, Easing, Sequence, interpolate, random,
  registerRoot, useCurrentFrame, useVideoConfig,
} from "remotion";

const fps = 30;
const sceneFrames = 90;
const overlap = 18;
const stride = sceneFrames - overlap;
const ease = Easing.inOut(Easing.sin);

const wedding = [
  { title: "相遇", line: "那天星光很轻，我却记得你的眼睛。", sky: "#2a1f40", light: "#efb9ac" },
  { title: "相知", line: "我们把日常，慢慢过成了诗。", sky: "#65414f", light: "#f9c9b6" },
  { title: "相爱", line: "人海漫长，我愿向你走去。", sky: "#834e60", light: "#f4b6ac" },
  { title: "相守", line: "往后每一个清晨，都与你同看。", sky: "#5a3d47", light: "#ffdeb4", gate: true },
];

const fantasy = [
  { title: "桃林初见", line: "一瓣落入掌心，春风便有了姓名。", sky: "#54364f", light: "#f7b2bd" },
  { title: "云上赴约", line: "隔着九重云海，仍记得来时那盏灯。", sky: "#283550", light: "#c3bbec", gate: true },
  { title: "三世重逢", line: "这一世，等桃花落尽，再一起归去。", sky: "#673a58", light: "#f9b9b7" },
];

const particles = Array.from({ length: 76 }, (_, index) => ({
  x: random(`x-${index}`) * 100,
  y: random(`y-${index}`) * 100,
  size: 6 + random(`size-${index}`) * 25,
  speed: 0.11 + random(`speed-${index}`) * 0.22,
  angle: random(`angle-${index}`) * 360,
  glow: index % 4 === 0,
}));

function Landscape({ frame, shot, isFantasy }) {
  return (
    <AbsoluteFill style={{ transform: `scale(${1.025 + frame / 2100})` }}>
      <AbsoluteFill style={{
        background: `radial-gradient(ellipse at 51% 55%, ${shot.light}, transparent 52%), linear-gradient(180deg, ${shot.sky} 6%, #9b6579 52%, #efd3c0 82%)`,
      }} />
      <div style={{
        position: "absolute", left: "46%", top: "31%", width: 305, aspectRatio: 1,
        borderRadius: "50%", background: "#fff0d8", boxShadow: `0 0 155px ${shot.light}`,
      }} />
      {["#986d88", "#765773", "#544058", "#382a40"].map((color, depth) => (
        <div key={color} style={{
          position: "absolute", height: "44%", width: "91%",
          left: depth % 2 === 0 ? "-25%" : "43%", top: `${56 + depth * 7}%`,
          borderRadius: depth % 2 === 0 ? "56% 80% 0 0" : "82% 45% 0 0",
          background: color,
          transform: `translateX(${frame * (depth + 1) / 2}px)`,
        }} />
      ))}
      <div style={{
        position: "absolute", inset: "51% -10% 12%",
        background: "radial-gradient(ellipse, #ffdfdf7a, transparent 66%)",
        transform: `translateX(${Math.sin(frame / 80) * 270}px)`,
      }} />
      {shot.gate && (
        <div style={{
          position: "absolute", left: "43%", top: "29%", width: "14%", height: "42%",
          border: "10px solid #ffe0bd", borderBottom: 0,
          borderRadius: isFantasy ? "18px 18px 0 0" : "290px 290px 0 0",
          boxShadow: "0 0 74px #fff0d67a, inset 0 0 62px #ffd4b366",
        }} />
      )}
      {particles.map((particle, index) => (
        <div key={index} style={{
          position: "absolute",
          left: `${particle.x + Math.sin(frame / 23 + particle.angle) * 2.2}%`,
          top: `${(particle.y + frame * particle.speed) % 100}%`,
          width: particle.glow ? 7 : particle.size,
          height: particle.glow ? 7 : particle.size * 0.53,
          borderRadius: particle.glow ? "50%" : "80% 10% 80% 10%",
          opacity: particle.glow ? 0.7 : 0.58,
          background: particle.glow ? "#fff1cb" : shot.light,
          boxShadow: particle.glow ? "0 0 32px #ffe9b9" : undefined,
          transform: `rotate(${particle.angle + frame * 1.2}deg)`,
        }} />
      ))}
    </AbsoluteFill>
  );
}

function Shot({ shot, index, count, isFantasy }) {
  const frame = useCurrentFrame();
  const fadeIn = interpolate(frame, [0, overlap], [index === 0 ? 1 : 0, 1], {
    extrapolateRight: "clamp", easing: ease,
  });
  const textOpacity = interpolate(frame, [8, 23, 69, 86], [0, 1, 1, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease,
  });
  const fadeOut = index === count - 1
    ? interpolate(frame, [75, sceneFrames - 1], [1, 0], { extrapolateLeft: "clamp", easing: ease })
    : 1;

  return (
    <AbsoluteFill style={{ opacity: fadeIn * fadeOut, overflow: "hidden" }}>
      <Landscape frame={frame} shot={shot} isFantasy={isFantasy} />
      <AbsoluteFill style={{ background: "linear-gradient(transparent 48%, #1e12236b 77%, #170e21c9)" }} />
      <div style={{
        position: "absolute", bottom: "16%", width: "100%", textAlign: "center",
        color: "#fff3df", opacity: textOpacity,
        fontFamily: '"Songti SC", "Noto Serif CJK SC", "Microsoft YaHei", serif',
        textShadow: "0 5px 28px #281626",
      }}>
        <div style={{ fontSize: 136, letterSpacing: "0.18em", paddingLeft: "0.18em" }}>{shot.title}</div>
        <div style={{ fontSize: 49, letterSpacing: "0.12em", marginTop: 34 }}>{shot.line}</div>
      </div>
    </AbsoluteFill>
  );
}

function Film({ isFantasy }) {
  const shots = isFantasy ? fantasy : wedding;
  const { width, height } = useVideoConfig();

  return (
    <AbsoluteFill style={{ background: "#170e21" }}>
      <AbsoluteFill style={{ width: 3840, height: 2160, transformOrigin: "top left", transform: `scale(${width / 3840}, ${height / 2160})` }}>
        {shots.map((shot, index) => (
          <Sequence key={shot.title} name={shot.title} from={index * stride} durationInFrames={sceneFrames}>
            <Shot shot={shot} index={index} count={shots.length} isFantasy={isFantasy} />
          </Sequence>
        ))}
      </AbsoluteFill>
    </AbsoluteFill>
  );
}

function Root() {
  return (
    <>
      <Composition id="Wedding" component={Film} fps={fps} width={3840} height={2160}
        durationInFrames={sceneFrames + (wedding.length - 1) * stride} defaultProps={{ isFantasy: false }} />
      <Composition id="PeachBlossom" component={Film} fps={fps} width={3840} height={2160}
        durationInFrames={sceneFrames + (fantasy.length - 1) * stride} defaultProps={{ isFantasy: true }} />
    </>
  );
}

registerRoot(Root);
