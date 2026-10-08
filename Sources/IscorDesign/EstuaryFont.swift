import CoreText
import SwiftUI

extension Estuary {
    /// Outfit, the system's typeface, at a size and a weight. It follows Dynamic Type relative to `textStyle`.
    ///
    /// The package ships Outfit (a variable font, every weight from thin to black) and registers it
    /// for the app's process the first time it is asked for: the app has nothing to bundle.
    ///
    ///     Text("Bonjour").font(Estuary.font(size: 28, weight: .bold, relativeTo: .title))
    public static func font(size: CGFloat, weight: Font.Weight = .regular, relativeTo textStyle: Font.TextStyle = .body) -> Font {
        registerFonts()
        return Font.custom(fontFamily, size: size, relativeTo: textStyle).weight(weight)
    }

    /// Registers Outfit for the app's process, for code that uses it by name (`NSFont(name: "Outfit", size: 17)`,
    /// `UIFont`, Core Text). `font(size:weight:relativeTo:)` calls it by itself. Safe to call more than once.
    ///
    /// - Returns: whether Outfit is available.
    @discardableResult
    public static func registerFonts() -> Bool { FontRegistration.outfit }
}

private enum FontRegistration {
    /// Registered once, the first time it is read (a static is initialised lazily and only once).
    static let outfit: Bool = {
        guard let url = Bundle.module.url(forResource: "Outfit", withExtension: "ttf") else { return false }
        var error: Unmanaged<CFError>?
        if CTFontManagerRegisterFontsForURL(url as CFURL, .process, &error) { return true }
        // Already registered by the app itself, or by a previous run of this code in the same process.
        let code = error.map { CFErrorGetCode($0.takeRetainedValue()) }
        return code == CTFontManagerError.alreadyRegistered.rawValue
    }()
}
