# 桃光短片

两个用 Remotion 写成的原创动画小样。画面通过渐变、分层山影和确定性的粒子动画生成。

- `Wedding` · 相遇、相知、相爱、相守。
- `PeachBlossom` · 桃林初见、云上赴约、三世重逢。

## 运行

```bash
npm ci
npm run studio
npm run render:wedding
npm run render:fantasy
```

渲染脚本输出 3840 × 2160、30 fps 的 H.264 MP4，文件分别位于 `out/wedding.mp4` 与 `out/peach-blossom.mp4`。分镜、中文文案、粒子速度与转场时长都在 `film.jsx`。若运行环境缺少中文字体，请先安装 Noto Serif CJK SC。

当前范围为无声的二维分镜小样。正式制作还需要人物动画、场景资产、配乐，以及 Three.js 或 Blender 的三维镜头。
