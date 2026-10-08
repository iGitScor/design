import SwiftUI

#if canImport(AppKit)
    import AppKit
#elseif canImport(UIKit)
    import UIKit
#endif

/// A token's colour in each scheme. It resolves itself against the appearance it is drawn in,
/// as SwiftUI `Color`, AppKit `NSColor` or UIKit `UIColor`.
public struct EstuaryColor: Sendable, Hashable {
    public let light: UInt32
    public let lightAlpha: Double
    public let dark: UInt32
    public let darkAlpha: Double

    public init(light: UInt32, lightAlpha: Double = 1, dark: UInt32, darkAlpha: Double = 1) {
        self.light = light
        self.lightAlpha = lightAlpha
        self.dark = dark
        self.darkAlpha = darkAlpha
    }

    /// Red, green, blue and alpha, from 0 to 1, in one scheme.
    public func components(dark isDark: Bool) -> (red: Double, green: Double, blue: Double, alpha: Double) {
        let hex = isDark ? dark : light
        return (
            Double((hex >> 16) & 0xFF) / 255, Double((hex >> 8) & 0xFF) / 255, Double(hex & 0xFF) / 255,
            isDark ? darkAlpha : lightAlpha
        )
    }

    #if canImport(AppKit)
        /// Follows the appearance it is drawn in (a window, a view, the menu bar).
        public var nsColor: NSColor {
            NSColor(name: nil) { appearance in
                let c = components(dark: appearance.bestMatch(from: [.aqua, .darkAqua]) == .darkAqua)
                return NSColor(srgbRed: c.red, green: c.green, blue: c.blue, alpha: c.alpha)
            }
        }

        public var color: Color { Color(nsColor: nsColor) }
    #elseif canImport(UIKit)
        public var uiColor: UIColor {
            UIColor { traits in
                let c = components(dark: traits.userInterfaceStyle == .dark)
                return UIColor(red: c.red, green: c.green, blue: c.blue, alpha: c.alpha)
            }
        }

        public var color: Color { Color(uiColor: uiColor) }
    #endif
}
