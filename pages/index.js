import React, { useState } from "react";
import Head from "next/head";
import styled from "@emotion/styled";
import useInterval from "@use-it/interval";
import Slider from "react-input-slider";
import { CirclePicker } from "react-color";
import { contrastRatio } from "chromatism";
import createPersistedState from "use-persisted-state";

import Reset from "../components/reset";

const useCopyState = createPersistedState("copy");
const useFPSState = createPersistedState("fps");
const useFontSizeState = createPersistedState("font-size");
const useColorState = createPersistedState("color");

const INITIAL_FPS = 1.5;
const INITIAL_FONT_SIZE = 25;
const INITIAL_COLOR = `#f44336`;

// const presets = [
//   {
//     name: "sos",
//     color: `#f44336`,
//     copy: "S.O.S"
//   },
//   {
//     name: "exit",
//     color: `#8bc34a`,
//     copy: "EXIT"
//   },
//   {
//     name: "security",
//     color: `#3f51b5`,
//     copy: "Security!"
//   }
// ];

const Hero = styled.main`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100vw;
  height: 100vh;
  background-color: ${props => props.bgColor || "#000"};
  color: #fafafa;
  overflow: hidden;
`;

const Title = styled.input`
  margin: 0;
  padding: 0;
  width: 100%;
  border: none;
  box-shadow: none;
  background: transparent;
  text-align: center;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.15;
  font-size: ${props => props.fontSize || INITIAL_FONT_SIZE}vw;
  font-weight: bolder;
  color: ${props => props.textColor || "#fff"};
`;

const Label = styled.label`
  color: #222;
  font-size: 1rem;
`;

const Control = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: fixed;
  bottom: 0;
  width: 100%;
`;

const Card = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 4px 4px 0 0;
  padding: 1rem 1rem 4rem 1rem;
  box-shadow: 0 4px 4px 4px rgba(0, 0, 0, 0.25);
  background-color: #ffffff;
`;

const EditButton = styled.button`
  margin-top: 1rem;
  align-self: center;
  position: relative;
  opacity: ${props => (props.isActive ? 1 : 0.5)};
  color: ${props =>
    props.isActive ? props.mainColor : props.textColor || "#000"};
  border-color: ${props =>
    props.isActive ? props.mainColor : props.textColor || "#000"};
  background-color: ${props =>
    !props.isActive ? "transparent" : props.textColor || "#000"};
  border-radius: 8px;
  font-size: 0.75rem;
  width: 8rem;
`;

const Buttons = styled.div`
  display: flex;
  flex-direction: row;
  align-items: baseline;
  justify-content: space-around;
  margin-bottom: 1rem;
  button + button {
    margin-left: 1rem;
  }
`;

const P = styled.p`
  margin-top: 1rem;
  text-align: center;
  color: #222;
`;

const useToggle = (initBool = false) => {
  const [val, setVal] = useState(initBool);
  const toggle = () => {
    setVal(!val);
  };
  return [val, toggle];
};

export default () => {
  const [copy, setCopy] = useCopyState("S.O.S");
  const [fps, setFps] = useFPSState(INITIAL_FPS);
  const [fontSize, setFontSize] = useFontSizeState(INITIAL_FONT_SIZE);
  const [mainColor, setMainColor] = useColorState(INITIAL_COLOR);
  const [shouldInvert, toggleInvert] = useToggle(true);
  const [shouldShowControl, toggleShowControl] = useToggle(false);
  // const [shouldShowPresets, toggleShowPresets] = useToggle(false);
  const [isTitleEditable, toggleTitleEditable] = useToggle(false);

  const interval = 1000 / fps;

  useInterval(toggleInvert, interval);

  const onChangeComplete = color => {
    setMainColor(color.hex);
  };

  const onChangeTitle = e => {
    if (isTitleEditable) {
      setCopy(e.target.value);
    }
  };

  const bgColor = shouldInvert
    ? contrastRatio(contrastRatio(mainColor).hex).hex
    : mainColor;
  const textColor = contrastRatio(bgColor).hex;

  return (
    <>
      <Reset />
      <Head>
        <title>{copy}</title>
        <link rel="manifest" href="/static/manifest.json" />
        <meta name="theme-color" content={INITIAL_COLOR} />
        <meta name="description" content="SOS @ Concerts!" />
      </Head>
      <Hero bgColor={bgColor}>
        <Title
          fontSize={fontSize}
          onChange={onChangeTitle}
          value={copy}
          textColor={textColor}
        />

        <Control>
          <Buttons>
            <EditButton
              isActive={shouldShowControl}
              onClick={toggleTitleEditable}
              textColor={textColor}
              mainColor={mainColor}
            >
              {isTitleEditable ? "Save Text" : "Edit Text"}
            </EditButton>
            <EditButton
              isActive={shouldShowControl}
              onClick={toggleShowControl}
              textColor={textColor}
              mainColor={mainColor}
            >
              {shouldShowControl ? "Hide Controls" : "Show Controls"}
            </EditButton>
            {/* <EditButton onClick={toggleShowPresets} textColor={textColor}>
              {shouldShowPresets ? "Hide Presets" : "Show Presets"}
            </EditButton> */}
          </Buttons>

          {shouldShowControl && (
            <Card>
              <Label>Speed: {fps.toFixed(1)}</Label>
              <Slider
                styles={{
                  active: {
                    backgroundColor: mainColor
                  },
                  track: {
                    marginBottom: "2rem",
                    marginTop: "1rem",
                    width: "100%"
                  }
                }}
                axis="x"
                x={fps}
                xstep={0.1}
                xmin={0.2}
                xmax={10}
                onChange={({ x }) => setFps(() => x)}
              />
              <Label>Font Size: {fontSize.toFixed(1)}</Label>
              <Slider
                styles={{
                  active: {
                    backgroundColor: mainColor
                  },
                  track: {
                    marginBottom: "2rem",
                    marginTop: "1rem",
                    width: "100%"
                  }
                }}
                axis="x"
                x={fontSize}
                xstep={1}
                xmin={1}
                xmax={100}
                onChange={({ x }) => setFontSize(() => x)}
              />
              <CirclePicker
                onChangeComplete={onChangeComplete}
                style={{
                  marginTop: "1rem"
                }}
              />
              <P>
                by <a href="https://twitter.com/mathdroid">mathdroid</a>.
              </P>

              <P>
                <a href="https://github.com/mathdroid/sos-concert">
                  source code
                </a>
              </P>
            </Card>
          )}
        </Control>
      </Hero>
    </>
  );
};
