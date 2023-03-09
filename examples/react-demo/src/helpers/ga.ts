import { HelpScreenButtonType } from "@prismadelabs/prismaid/dist/model/HelpScreen";

export enum GAEventType {
  // invalid app call
  Error_InvalidInvocation,

  // session expired
  Error_SessionExpired,

  // device check
  Error_UnsupportedDevice,
  Error_UnsupportedBrowser,
  Error_ScreenTooSmall,

  // network connection
  Error_Network_Slow,
  Error_Network_Offline,

  // Notification
  Notification_ClickToGoToFAQ,
  Notification_ClickToGoToStart,

  // WELCOME
  Welcome_ClickToStart,

  // SELECT
  Select_SelectCardType,
  Select_ClickCardTypeSlide,
  Select_SwipeCardTypeSlide,
  Select_ClickToStart,
  // TUTORIAL
  Tutorial_ClickToGoBackToStart,
  Tutorial_ClickToSelectPreviousSlide,
  Tutorial_SwipeToSelectSlide,
  Tutorial_ClickToSelectNextSlide,
  Tutorial_ClickToFinishTutorial,
  // TOUCH
  Touch_ToggleSensitivity,
  Touch_ClickToConfirm,
  // SWIPE
  Swipe_ClickToGoBack,
  Swipe_ClickToGoToHelp,
  Swipe_Success,
  Swipe_Success_Again,
  Swipe_Error,
  Swipe_Error_Help,
  Swipe_Error_Failure,
  Swipe_Error_HardFailure,
  // FAQ
  FAQ_ClickToGoBack,
  Notification_ClickToGoToTutorial,
}

interface GAEvent {
  category: string;
  action: string;
  label?: string;
  value?: string;
}

export class GA {
  ga_events: GAEvent[] = [];

  constructor() {
    // invalid app call
    this.ga_events[GAEventType.Error_InvalidInvocation] = {
      category: "error",
      action: "link_invalid",
    };
    // session expired
    this.ga_events[GAEventType.Error_SessionExpired] = {
      category: "error",
      action: "session_expired",
    };
    // network
    this.ga_events[GAEventType.Error_Network_Slow] = {
      category: "warning",
      action: "network_slow",
    };
    this.ga_events[GAEventType.Error_Network_Offline] = {
      category: "warning",
      action: "network_offline",
    };
    // Notification
    this.ga_events[GAEventType.Error_UnsupportedBrowser] = {
      category: "notification",
      action: "notification_browser_unsupported",
    };
    this.ga_events[GAEventType.Error_UnsupportedDevice] = {
      category: "notification",
      action: "notification_device_unsupported",
    };
    this.ga_events[GAEventType.Error_ScreenTooSmall] = {
      category: "notification",
      action: "notification_screen_too_small",
    };
    this.ga_events[GAEventType.Notification_ClickToGoToFAQ] = {
      category: "notification",
      action: "notification_faq_click",
    };
    this.ga_events[GAEventType.Notification_ClickToGoToStart] = {
      category: "notification",
      action: "notification_start_click",
    };
    this.ga_events[GAEventType.Notification_ClickToGoToTutorial] = {
      category: "notification",
      action: "notification_tutorial_click",
    };

    // Welcome
    this.ga_events[GAEventType.Welcome_ClickToStart] = {
      category: "welcome",
      action: "welcome_start_click",
    };

    // Select
    this.ga_events[GAEventType.Select_SelectCardType] = {
      category: "card_select",
      action: "card_select_select",
    };
    this.ga_events[GAEventType.Select_ClickCardTypeSlide] = {
      category: "card_select",
      action: "card_select_dot",
    };
    this.ga_events[GAEventType.Select_SwipeCardTypeSlide] = {
      category: "card_select",
      action: "card_select_swipe",
    };
    this.ga_events[GAEventType.Select_ClickToStart] = {
      category: "card_select",
      action: "card_select_start_click",
    };

    // Tutorial
    this.ga_events[GAEventType.Tutorial_ClickToGoBackToStart] = {
      category: "tutorial",
      action: "tutorial_backtostart_click",
    };
    this.ga_events[GAEventType.Tutorial_ClickToSelectPreviousSlide] = {
      category: "tutorial",
      action: "tutorial_slideback_click",
    };
    this.ga_events[GAEventType.Tutorial_ClickToSelectNextSlide] = {
      category: "tutorial",
      action: "tutorial_slidenext_click",
    };
    this.ga_events[GAEventType.Tutorial_SwipeToSelectSlide] = {
      category: "tutorial",
      action: "tutorial_swipe",
    };
    this.ga_events[GAEventType.Tutorial_ClickToFinishTutorial] = {
      category: "tutorial",
      action: "tutorial_finish_click",
    };

    // Touch
    this.ga_events[GAEventType.Touch_ToggleSensitivity] = {
      category: "touchsensitivity",
      action: "touchsensitivity_toggle",
    };
    this.ga_events[GAEventType.Touch_ClickToConfirm] = {
      category: "touchsensitivity",
      action: "touchsensitivity_confirm",
    };

    // Swipe screen
    this.ga_events[GAEventType.Swipe_ClickToGoBack] = {
      category: "swipescreen",
      action: "swipescreen_back_click",
    };
    this.ga_events[GAEventType.Swipe_ClickToGoToHelp] = {
      category: "swipescreen",
      action: "swipescreen_help_click",
    };
    this.ga_events[GAEventType.Swipe_Success] = {
      category: "swipescreen",
      action: "swipescreen_success_done",
    };
    this.ga_events[GAEventType.Swipe_Success_Again] = {
      category: "swipescreen",
      action: "swipescreen_success_again",
    };
    this.ga_events[GAEventType.Swipe_Error] = {
      category: "swipescreen",
      action: "swipescreen_error",
    };
    this.ga_events[GAEventType.Swipe_Error_Failure] = {
      category: "swipescreen",
      action: "swipescreen_failure_final_canretry",
    };
    this.ga_events[GAEventType.Swipe_Error_HardFailure] = {
      category: "swipescreen",
      action: "swipescreen_failure_final",
    };
    this.ga_events[GAEventType.Swipe_Error_Help] = {
      category: "swipescreen",
      action: "swipescreen_failure_showhelp",
    };

    // FAQ
    this.ga_events[GAEventType.FAQ_ClickToGoBack] = {
      category: "FAQ",
      action: "faq_back_click",
    };
  }

  trackPageView(clientWindow: any, page: string) {
    console.log("tracking pageview as event...", page);

    clientWindow.gtag("event", "pageview", {
      event_category: "pageview",
      event_label: page,
    });
  }

  trackInteractiveHelpScreen(clientWindow: any, helpScreen: string) {
    console.log("tracking interactiveHelpScreen: ", helpScreen);

    clientWindow.gtag("event", "interactiveHelp_" + helpScreen, {
      event_category: "interactiveHelp",
    });
  }

  trackInteractiveHelpClick(
    clientWindow: any,
    helpScreen: string,
    buttonType: HelpScreenButtonType
  ) {
    console.log("tracking interactiveHelpClick: ", helpScreen, buttonType);

    let type;
    switch (buttonType) {
      case HelpScreenButtonType.ok:
        type = "ok";
        break;
      case HelpScreenButtonType.yes:
        type = "yes";
        break;
      case HelpScreenButtonType.no:
        type = "no";
        break;
      default:
        type = "error";
        break;
    }

    clientWindow.gtag(
      "event",
      "interactiveHelpClick_" + helpScreen + "_" + type,
      {
        event_category: "interactiveHelp",
      }
    );
  }

  trackInteractiveHelpDismiss(clientWindow: any, helpScreen: string) {
    console.log("tracking interactiveHelpDismiss: ", helpScreen);

    clientWindow.gtag(
      "event",
      "interactiveHelpClick_" + helpScreen + "_dismiss",
      {
        event_category: "interactiveHelp",
      }
    );
  }

  trackEvent(
    clientWindow: any,
    eventType: GAEventType,
    label?: string,
    value?: number
  ) {
    const event = this.ga_events[eventType];
    console.log(
      "tracking event...",
      event.category,
      event.action,
      event.label,
      label,
      label ?? event.label,
      value
    );

    clientWindow.gtag("event", event.action, {
      event_category: event.category,
      event_label: label ?? event.label,
      value,
    });
  }
}
