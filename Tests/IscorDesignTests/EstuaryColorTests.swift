import Testing

@testable import IscorDesign

struct EstuaryColorTests {
    @Test func readsEachSchemeFromItsHexValue() {
        let ink = Estuary.ink.components(dark: false)
        #expect(ink.red == 0x11 / 255.0 && ink.green == 0x11 / 255.0 && ink.blue == 0x11 / 255.0 && ink.alpha == 1)
        let lime = Estuary.accent.components(dark: true)
        #expect(lime.red == 0xB9 / 255.0 && lime.green == 1 && lime.blue == 0x66 / 255.0)
    }

    @Test func keepsTheTintsTransparency() {
        #expect(Estuary.accentSoft.components(dark: false).alpha == 0.35)
        #expect(Estuary.accentSoft.components(dark: true).alpha == 0.14)
    }

    @Test func givesTheRadiiAndTheFont() {
        #expect(Estuary.Radius.xl == 34)
        #expect(Estuary.fontFamily == "Outfit")
    }

    /// Increase Contrast darkens the inks on light and strengthens the lines; a token that doesn't change keeps its
    /// colour.
    @Test func followsIncreaseContrast() {
        let ink = Estuary.ink.components(dark: false, increasedContrast: true)
        #expect(ink.red == 0 && ink.green == 0 && ink.blue == 0)
        #expect(Estuary.line.components(dark: true, increasedContrast: true).alpha == 0.35)
        #expect(Estuary.backdrop.components(dark: false, increasedContrast: true) == Estuary.backdrop.components(dark: false))
        #expect(Estuary.accentSoft.components(dark: false, increasedContrast: true).alpha == 0.6)
    }

    @Test func givesTheSoftStatusFills() {
        #expect(Estuary.okSoft.components(dark: true).alpha == 0.16)
        #expect(Estuary.okSoft.components(dark: false).red == Estuary.ok.components(dark: false).red)
    }
}
