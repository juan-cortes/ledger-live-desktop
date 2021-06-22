// @flow

import React from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { EXPERIMENTAL_MARKET_INDICATOR_SETTINGS } from "~/config/constants";
import { langAndRegionSelector } from "~/renderer/reducers/settings";
import { getCurrentDevice } from "~/renderer/reducers/devices";
import TrackPage from "~/renderer/analytics/TrackPage";
import { SettingsSectionBody as Body, SettingsSectionRow as Row } from "../../SettingsSection";
import CounterValueSelect from "./CounterValueSelect";
import LanguageSelect from "./LanguageSelect";
import RegionSelect from "./RegionSelect";
import ThemeSelect from "./ThemeSelect";
import MarketIndicatorRadio from "./MarketIndicatorRadio";
import PasswordButton from "./PasswordButton";
import PasswordAutoLockSelect from "./PasswordAutoLockSelect";
import SentryLogsButton from "./SentryLogsButton";
import TrustDeviceButton from "./TrustDeviceButton";
import ShareAnalyticsButton from "./ShareAnalyticsButton";
import CarouselVisibility from "./CarouselVisibility";
import { hasPasswordSelector } from "~/renderer/reducers/application";

const SectionGeneral = () => {
  const { useSystem } = useSelector(langAndRegionSelector);
  const hasPassword = useSelector(hasPasswordSelector);
  const device = useSelector(getCurrentDevice);
  const { t } = useTranslation();

  return (
    <>
      <TrackPage category="Settings" name="Display" />
      <Body>
        <Row
          title={t("settings.display.counterValue")}
          desc={t("settings.display.counterValueDesc")}
        >
          <CounterValueSelect />
        </Row>

        <Row title={t("settings.display.language")} desc={t("settings.display.languageDesc")}>
          <LanguageSelect />
        </Row>
        {useSystem ? null : (
          <Row title={t("settings.display.region")} desc={t("settings.display.regionDesc")}>
            <RegionSelect />
          </Row>
        )}

        <Row title={t("settings.display.theme")} desc={t("settings.display.themeDesc")}>
          <ThemeSelect />
        </Row>

        {EXPERIMENTAL_MARKET_INDICATOR_SETTINGS ? (
          <Row title={t("settings.display.stock")} desc={t("settings.display.stockDesc")}>
            <MarketIndicatorRadio />
          </Row>
        ) : null}

        <Row title={t("settings.profile.password")} desc={t("settings.profile.passwordDesc")}>
          <PasswordButton />
        </Row>
        {hasPassword ? (
          <>
            <Row
              title={t("settings.profile.passwordAutoLock")}
              desc={t("settings.profile.passwordAutoLockDesc")}
            >
              <PasswordAutoLockSelect />
            </Row>
            {device ? (
              <Row
                title={"Trust this device to unlock Ledger Live"}
                desc={
                  "If enabled you will be able to unlock Ledger Live by connecting and entering the pin on the device"
                }
              >
                <TrustDeviceButton />
              </Row>
            ) : null}
          </>
        ) : null}
        <Row
          title={t("settings.profile.reportErrors")}
          desc={t("settings.profile.reportErrorsDesc")}
        >
          <SentryLogsButton />
        </Row>
        <Row title={t("settings.profile.analytics")} desc={t("settings.profile.analyticsDesc")}>
          <ShareAnalyticsButton />
        </Row>
        <Row
          title={t("settings.display.carouselVisibility")}
          desc={t("settings.display.carouselVisibilityDesc")}
        >
          <CarouselVisibility />
        </Row>
      </Body>
    </>
  );
};

export default SectionGeneral;
