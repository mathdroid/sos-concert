import React, { useState } from "react";
import Head from "next/head";
import styled from "@emotion/styled";
import useInterval from "@use-it/interval";
import Slider from "react-input-slider";
import { CirclePicker } from "react-color";

import Reset from "../components/reset";

const INITIAL_FPS = 1.5;
const INITIAL_FONT_SIZE = 25;
const INITIAL_COLOR = `#f44336`;

const Hero = styled.main`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100vw;
  height: 100vh;
  background-color: ${props =>
    props.shouldInvert ? "#222" : props.mainColor || INITIAL_COLOR};
  color: #fafafa;
  overflow: hidden;
`;

const Title = styled.h1`
  text-align: center;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.15;
  font-size: ${props => props.fontSize || INITIAL_FONT_SIZE}vw;
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
  opacity: 0.5;
  color: #111;
  border-color: #111;
  background-color: transparent;
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
`;

const useToggle = (initBool = false) => {
  const [val, setVal] = useState(initBool);
  const toggle = () => {
    setVal(!val);
  };
  return [val, toggle];
};

export default () => {
  const [copy, setCopy] = useState("S.O.S");
  const [shouldInvert, toggleInvert] = useToggle(true);
  const [fps, setFps] = useState(INITIAL_FPS);
  const [fontSize, setFontSize] = useState(INITIAL_FONT_SIZE);
  const [shouldShowControl, toggleShowControl] = useToggle(false);
  const [isTitleEditable, toggleTitleEditable] = useToggle(false);
  const [mainColor, setMainColor] = useState(INITIAL_COLOR);

  const interval = 1000 / fps;

  useInterval(toggleInvert, interval);

  const onChangeComplete = color => {
    setMainColor(color.hex);
  };

  return (
    <>
      <Reset />
      <Head>
        <title>{copy}</title>
      </Head>
      <Hero shouldInvert={shouldInvert} mainColor={mainColor}>
        <Title fontSize={fontSize} contentEditable={isTitleEditable}>
          {copy}
        </Title>

        <Control>
          <Buttons>
            <EditButton onClick={toggleTitleEditable}>
              {isTitleEditable ? "Save Text" : "Edit Text"}
            </EditButton>
            <EditButton onClick={toggleShowControl}>
              {shouldShowControl ? "Hide Controls" : "Show Controls"}
            </EditButton>
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
                    marginBottom: "1rem"
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
                    marginBottom: "1rem"
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
            </Card>
          )}
        </Control>
      </Hero>
    </>
  );
};
