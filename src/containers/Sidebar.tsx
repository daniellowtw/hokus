import React from "react";
import { List, ListItem } from "material-ui/List";
import Subheader from "material-ui/Subheader";
import IconLockMenu from "material-ui/svg-icons/action/lock-outline";
import IconMenu from "material-ui/svg-icons/navigation/menu";
import Border from "./../components/Border";

import darkBaseTheme from "material-ui/styles/baseThemes/darkBaseTheme";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import getMuiTheme from "material-ui/styles/getMuiTheme";
import { FlatButton, IconButton } from "material-ui";

const Fragment = React.Fragment;
const translucentColor = "RGBA(255,255,255,.2)";
const translucentColorSubtle = "RGBA(255,255,255,.05)";

const MenuBorder = ({ children }: any) => (
  <Border style={{ margin: "0 16px", borderRadius: 3, padding: "1px", borderColor: translucentColor }}>
    {children}
  </Border>
);

const WhiteSubHeader = ({ children }: any) => (
  <Subheader style={{ color: "white", fontWeight: 300 }}>{children}</Subheader>
);

export type SidebarMenu = {
  title: string;
  key?: string;
  widget?: any;
  items?: Array<{
    active: boolean;
    label: string;
    onClick: () => void;
  }>;
};

export type SidebarProps = {
  menus: Array<SidebarMenu>;
  menuIsLocked: boolean;
  onLockMenuClicked: () => void;
  onToggleItemVisibility: () => void;
  hideItems: boolean;
};

export class Sidebar extends React.PureComponent<SidebarProps> {
  render() {
    const { hideItems, menus, menuIsLocked, onToggleItemVisibility } = this.props;
    const menusNodes = menus.map(menu => {
      return (
        <Fragment key={menu.key || menu.title}>
          <WhiteSubHeader>{menu.title}</WhiteSubHeader>
          {menu.widget}
          {menu.items && (
            <MenuBorder>
              <List style={{ padding: 0 }}>
                {menu.items.map((item, index) => {
                  return (
                    <ListItem
                      key={index}
                      innerDivStyle={{ background: item.active ? translucentColorSubtle : undefined }}
                      onClick={item.onClick}
                      primaryText={item.label}
                    />
                  );
                })}
              </List>
            </MenuBorder>
          )}
        </Fragment>
      );
    });

    return (
      <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
        <React.Fragment>
          <div className={"slideFadeInRight animated"} style={{ position: "relative", opacity: 1 }}>
            <IconMenu style={{ position: "absolute", right: "21px", top: "15px" }} />
            <FlatButton
              style={Object.assign(
                {},
                { height: "calc(100vh - 42px)", width: "100%", position: "absolute" },
                { transition: menuIsLocked ? undefined : "opacity 1s linear" },
                hideItems ? { opacity: 1 } : { opacity: 0, pointerEvents: "none" }
              )}
              label=" "
              onClick={() => {
                onToggleItemVisibility();
              }}
            />

            <div
              style={{
                width: "280px",
                transition: "all .2s",
                opacity: hideItems ? 0 : 1,
                pointerEvents: hideItems ? "none" : undefined
              }}
            >
              <IconButton
                onClick={() => this.props.onLockMenuClicked()}
                style={{ position: "absolute", right: "48px", top: "3px" }}
                iconStyle={{ opacity: menuIsLocked ? "1" : ".2" }}
              >
                <IconLockMenu />}
              </IconButton>
              {menusNodes}
              <br />
            </div>
          </div>
        </React.Fragment>
      </MuiThemeProvider>
    );
  }
}
