import CoreText
import SwiftUI
import Testing

@testable import IscorDesign

struct EstuaryFontTests {
    @Test func registersOutfitOnceAndAgain() {
        #expect(Estuary.registerFonts())
        #expect(Estuary.registerFonts())
        let font = CTFontCreateWithName(Estuary.fontFamily as CFString, 17, nil)
        #expect(CTFontCopyFamilyName(font) as String == "Outfit")
    }

    /// The width of a line set in a font, drawn by SwiftUI.
    @MainActor private func width(_ font: Font) -> CGFloat {
        ImageRenderer(content: Text("Where the river meets the sea").font(font).fixedSize()).cgImage.map { CGFloat($0.width) } ?? 0
    }

    @Test @MainActor func drawsInOutfitAndAtTheWeightAsked() {
        let regular = width(Estuary.font(size: 40))
        let bold = width(Estuary.font(size: 40, weight: .bold))
        let system = width(.system(size: 40))
        #expect(regular > 0)
        #expect(regular != system, "Outfit, not the system font it falls back to")
        #expect(bold > regular, "the variable font's weight axis follows the weight")
    }
}

struct EstuaryShapeStyleTests {
    @Test func resolvesInTheViewsColourScheme() {
        var environment = EnvironmentValues()
        environment.colorScheme = .light
        let light = Estuary.ink.resolve(in: environment)
        environment.colorScheme = .dark
        let dark = Estuary.ink.resolve(in: environment)
        #expect(abs(Double(light.red) - 0x11 / 255.0) < 0.002)
        #expect(abs(Double(dark.red) - 0xE4 / 255.0) < 0.002)
        #expect(abs(Double(Estuary.accentSoft.resolve(in: environment).opacity) - 0.14) < 0.002)
    }
}
