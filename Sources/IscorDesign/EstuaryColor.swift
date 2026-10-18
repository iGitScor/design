import SwiftUI

#if canImport(AppKit)
    import AppKit
#elseif canImport(UIKit)
    import UIKit
#endif

/// A token's colour in each scheme, and under Increase Contrast. It resolves itself against the appearance it is
/// drawn in, as SwiftUI `Color`, AppKit `NSColor` or UIKit `UIColor`.
public struct EstuaryColor: Sendable, Hashable {
    public let light: UInt32
    public let lightAlpha: Double
    public let dark: UInt32
    public let darkAlpha: Double
    /// Under Increase Contrast; the plain colour when the token doesn't change.
    public let contrastLight: UInt32
    public let contrastLightAlpha: Double
    public let contrastDark: UInt32
    public let contrastDarkAlpha: Double

    public init(
        light: UInt32, lightAlpha: Double = 1, dark: UInt32, darkAlpha: Double = 1, contrastLight: UInt32? = nil,
        contrastLightAlpha: Double? = nil, contrastDark: UInt32? = nil, contrastDarkAlpha: Double? = nil
    ) {
        self.light = light
        self.lightAlpha = lightAlpha
        self.dark = dark
        self.darkAlpha = darkAlpha
        self.contrastLight = contrastLight ?? light
        self.contrastLightAlpha = contrastLightAlpha ?? (contrastLight == nil ? lightAlpha : 1)
        self.contrastDark = contrastDark ?? dark
        self.contrastDarkAlpha = contrastDarkAlpha ?? (contrastDark == nil ? darkAlpha : 1)
    }

    /// Red, green, blue and alpha, from 0 to 1, in one scheme, with Increase Contrast on or off.
    public func components(dark isDark: Bool, increasedContrast: Bool = false) -> (
        red: Double, green: Double, blue: Double, alpha: Double
    ) {
        let (hex, alpha) =
            switch (isDark, increasedContrast) {
            case (false, false): (light, lightAlpha)
            case (true, false): (dark, darkAlpha)
            case (false, true): (contrastLight, contrastLightAlpha)
            case (true, true): (contrastDark, contrastDarkAlpha)
            }
        return (Double((hex >> 16) & 0xFF) / 255, Double((hex >> 8) & 0xFF) / 255, Double(hex & 0xFF) / 255, alpha)
    }

    #if canImport(AppKit)
        /// Follows the appearance it is drawn in (a window, a view, the menu bar), Increase Contrast included.
        public var nsColor: NSColor {
            NSColor(name: nil) { appearance in
                let match = appearance.bestMatch(from: [
                    .aqua, .darkAqua, .accessibilityHighContrastAqua, .accessibilityHighContrastDarkAqua,
                ])
                let c = components(
                    dark: match == .darkAqua || match == .accessibilityHighContrastDarkAqua,
                    increasedContrast: match == .accessibilityHighContrastAqua
                        || match == .accessibilityHighContrastDarkAqua)
                return NSColor(srgbRed: c.red, green: c.green, blue: c.blue, alpha: c.alpha)
            }
        }

        public var color: Color { Color(nsColor: nsColor) }
    #elseif canImport(UIKit)
        public var uiColor: UIColor {
            UIColor { traits in
                let c = components(
                    dark: traits.userInterfaceStyle == .dark, increasedContrast: traits.accessibilityContrast == .high)
                return UIColor(red: c.red, green: c.green, blue: c.blue, alpha: c.alpha)
            }
        }

        public var color: Color { Color(uiColor: uiColor) }
    #endif
}
