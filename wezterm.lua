local wezterm = require 'wezterm'
local mux = wezterm.mux

wezterm.on('gui-startup', function()
    -- utworzenie okna
    local tab, left_pane_1, window = mux.spawn_window {
        cwd = 'A://______//__________Programing//____________Rolnik//node-server',
    }

    -- ustawienie dokładnego rozmiaru okna
    local gui_win = window:gui_window()
    gui_win:set_inner_size(2200, 1400)

    -- podział pionowy: lewo / prawo
    local right_pane_1 = left_pane_1:split {
        direction = 'Right',
        size = 0.5,
        cwd = 'A://______//__________Programing//____________Rolnik//app',
    }

    -- LEWA STRONA: 2 panele poziome
    local left_pane_2 = left_pane_1:split {
        direction = 'Bottom',
        size = .66,
    }

    -- PRAWA STRONA: 3 panele poziome
    local right_pane_2 = right_pane_1:split {
        direction = 'Bottom',
        size = 0.75,
        cwd = 'A://______//__________Programing//____________Rolnik//app',
    }

    local right_pane_3 = right_pane_2:split {
        direction = 'Bottom',
        size = 0.65,
        cwd = 'A://______//__________Programing//____________Rolnik//app',
    }

    -- Funkcja z opóźnieniem
    local function send_cmd_with_delay(pane, cmd)
        wezterm.sleep_ms(100)
        pane:send_text(cmd .. "\r")
    end

    -- WYWOŁANIE KOMEND W PANELACH Z OPÓŹNIENIEM
    send_cmd_with_delay(left_pane_1, "npm run t")
    send_cmd_with_delay(left_pane_2, "npm run s")

    send_cmd_with_delay(right_pane_1, "npm run t")
    send_cmd_with_delay(right_pane_2, "npm run g")
    send_cmd_with_delay(right_pane_3, "npm run ns")
end)

return {
    launch_menu = {
        {
            label = 'PowerShell 7',
            args = { 'pwsh.exe', '-NoLogo' },
        },
        {
            label = 'CMD',
            args = { 'cmd.exe' },
        },
        {
            label = 'Git Bash',
            args = { 'C:/Program Files/Git/bin/bash.exe', '--login', '-i' },
        },
        {
            label = 'Notepad++',
            args = { 'C:/Program Files/Notepad++/notepad++.exe' },
        },
        {
            label = 'Kalkulator',
            args = { 'calc.exe' },
        },
        {
            label = 'Eksplorator plików',
            args = { 'explorer.exe' },
        },
        {
            label = 'Windows Terminal (wt)',
            args = { 'wt.exe' },
        },
        {
            label = 'Menedżer zadań',
            args = { 'taskmgr.exe' },
        },
        {
            label = 'Konfiguracja systemu (msconfig)',
            args = { 'msconfig.exe' },
        },
        {
            label = 'Edytor rejestru (regedit)',
            args = { 'regedit.exe' },
        },
        {
            label = 'Usługi (services.msc)',
            args = { 'mmc', 'services.msc' },
        },
        {
            label = 'Zarządzanie dyskami (diskmgmt.msc)',
            args = { 'mmc', 'diskmgmt.msc' },
        },
        {
            label = 'Menedżer urządzeń (devmgmt.msc)',
            args = { 'mmc', 'devmgmt.msc' },
        },
    },

    keys = {
        {
            key = "Enter",
            mods = "ALT|SHIFT",
            action = wezterm.action.SplitHorizontal({ domain = "CurrentPaneDomain" }),
        },
        {
            key = "Enter",
            mods = "CTRL|SHIFT",
            action = wezterm.action.SplitVertical({ domain = "CurrentPaneDomain" }),
        },
        {
            key = "w",
            mods = "CTRL|SHIFT",
            action = wezterm.action.CloseCurrentPane({ confirm = true }),
        },
        {
            key = "LeftArrow",
            mods = "CTRL|SHIFT",
            action = wezterm.action.ActivatePaneDirection("Left"),
        },
        {
            key = "RightArrow",
            mods = "CTRL|SHIFT",
            action = wezterm.action.ActivatePaneDirection("Right"),
        },
        {
            key = "UpArrow",
            mods = "CTRL|SHIFT",
            action = wezterm.action.ActivatePaneDirection("Up"),
        },
        {
            key = "DownArrow",
            mods = "CTRL|SHIFT",
            action = wezterm.action.ActivatePaneDirection("Down"),
        },
        -- Przypisanie Ctrl + V do wklejania ze schowka
        {
            key = 'v',
            mods = 'CTRL',
            action = wezterm.action.PasteFrom 'Clipboard',
        },
        -- (opcjonalnie) usunięcie domyślnego Shift + Ctrl + V
        {
            key = 'v',
            mods = 'CTRL|SHIFT',
            action = wezterm.action.DisableDefaultAssignment,
        },
        -- Ctrl + C – kopiuj do schowka
        {
            key = 'c',
            mods = 'CTRL',
            action = wezterm.action.CopyTo 'Clipboard',
        },
        -- Ctrl + V – wklej ze schowka
        {
            key = 'v',
            mods = 'CTRL',
            action = wezterm.action.PasteFrom 'Clipboard',
        },
        -- Wysyłanie SIGINT (czyli dawne Ctrl + C): Ctrl + Esc
        {
            key = 'Escape',
            -- mods = 'CTRL',
            action = wezterm.action.SendKey {
                key = 'c',
                mods = 'CTRL',
            },
        },
        {
            key = 'LeftArrow',
            mods = 'ALT',
            action = wezterm.action.ActivatePaneDirection 'Left',
        },
        {
            key = 'RightArrow',
            mods = 'ALT',
            action = wezterm.action.ActivatePaneDirection 'Right',
        },
        {
            key = 'UpArrow',
            mods = 'ALT',
            action = wezterm.action.ActivatePaneDirection 'Up',
        },
        {
            key = 'DownArrow',
            mods = 'ALT',
            action = wezterm.action.ActivatePaneDirection 'Down',
        },
    },
    -- font = wezterm.font("Consolas"),
    font = wezterm.font_with_fallback {
        'Fira Code',
        'DengXian',
    },
    colors = {
        background = "#222",
        foreground = "#0dcf0d",    -- jasnozielony
        cursor_bg = "#caff0c",     -- kolor wypełnienia karetki
        cursor_border = "#caff0c", -- opcjonalnie: obrys kursora
        cursor_fg = "#000000",     -- kolor tekstu pod kursorem (dla trybu bloczkowego)
        tab_bar = {
            background = "#1e1e1e",
            active_tab = {
                bg_color = "#005f87",
                fg_color = "#ffffff",
            },
            inactive_tab = {
                bg_color = "#2e2e2e",
                fg_color = "#888888",
            },
            inactive_tab_hover = {
                bg_color = "#3e3e3e",
                fg_color = "#aaaaaa",
            },
            new_tab = {
                bg_color = "#1e1e1e",
                fg_color = "#ffffff",
            },
        }
    },
    window_frame = {
        border_left_width = '3px',
        border_right_width = '3px',
        border_bottom_height = '3px',
        border_top_height = '3px',
        border_left_color = '#333333',
        border_right_color = '#333333',
        border_bottom_color = '#333333',
        border_top_color = '#333333',
    },
    window_padding = {
        -- left = 15,
        -- right = 15,
        -- top = 5,
        -- bottom = 5,
    },
    font_size = 10.0, -- lub inna wielkość czcionki, np. 12.5
    -- launch_menu = launch_menu,
    enable_tab_bar = true,
    hide_tab_bar_if_only_one_tab = false,
    default_gui_startup_args = { 'start', '--always-new-process' },
    color_scheme = 'Batman',
}
