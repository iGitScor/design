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
}
