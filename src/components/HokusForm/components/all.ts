import AccordionDynamic from "./AccordionDynamic";
import AceDynamic from "./AceDynamic";
//import ArrayDynamic from "./ArrayDynamic";
import ChipsDynamic from "./ChipsDynamic";
import DateDynamic from "./DateDynamic";
import EmptyLineDynamic from "./EmptyLineDynamic";
import { HiddenDynamic } from "./../../HoForm/HiddenDynamic";
import InfoDynamic from "./InfoDynamic";
import LeafArrayDynamic from "./LeafArrayDynamic";
import MarkdownDynamic from "./MarkdownDynamic";
import NestDynamic from "./NestDynamic";
import PullDynamic from "./PullDynamic";
import TextFieldDynamic from "./TextFieldNumberDynamic";
import TextFieldNumberDynamic from "./TextFieldDynamic";
import ToggleDynamic from "./ToggleDynamic";
import ReadonlyDynamic from "./ReadonlyDynamic";
import BundleManagerDynamic from "./BundleManagerDynamic";
import SectionDynamic from "./SectionDynamic";
import SelectDynamic from "./SelectDynamic";
import BundleImgThumbDynamic from "./BundleImgThumbDynamic";
import { ComponentProps } from "react";
import * as React from "react";

// Explicitly specify type so the compiler can help.
const allComponents: Array<React.ComponentClass<ComponentProps<any>, any>> = [
  AccordionDynamic,
  AceDynamic,
  // ArrayDynamic,
  BundleImgThumbDynamic,
  ChipsDynamic,
  DateDynamic,
  EmptyLineDynamic,
  LeafArrayDynamic,
  HiddenDynamic,
  InfoDynamic,
  MarkdownDynamic,
  NestDynamic,
  PullDynamic,
  ReadonlyDynamic,
  BundleManagerDynamic,
  SectionDynamic,
  SelectDynamic,
  TextFieldDynamic,
  TextFieldNumberDynamic,
  ToggleDynamic
];
export default allComponents;
