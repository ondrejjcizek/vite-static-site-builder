export const viewports = {
	small: [320, 539],
	smallWide: [540, 767],
	medium: [768, 1023],
	large: [1024, 1199],
	xlarge: [1200, 1399],
	xxlarge: [1400, 1919],
	xxxlarge: [1920]
}

export const queries = {
	// Media > Max | Up
	smallUp: `(min-width: ${viewports.small[0]}px)`,
	smallMax: `(max-width: ${viewports.small[1]}px)`,
	smallWideUp: `(min-width: ${viewports.smallWide[0]}px)`,
	smallWideMax: `(max-width: ${viewports.smallWide[1]}px)`,
	mediumUp: `(min-width: ${viewports.medium[0]}px)`,
	mediumMax: `(max-width: ${viewports.medium[1]}px)`,
	largeUp: `(min-width: ${viewports.large[0]}px)`,
	largeMax: `(max-width: ${viewports.large[1]}px)`,
	xlargeUp: `(min-width: ${viewports.xlarge[0]}px)`,
	xlargeMax: `(max-width: ${viewports.xlarge[1]}px)`,
	xxlargeUp: `(min-width: ${viewports.xxlarge[0]}px)`,
	xxlargeMax: `(max-width: ${viewports.xxlarge[1]}px)`,
	xxxlargeUp: `(min-width: ${viewports.xxxlarge[0]}px)`,

	// Media > Only
	smallOnly: `(min-width: ${viewports.small[0]}px) and (max-width: ${viewports.small[1]}px)`,
	smallWideOnly: `(min-width: ${viewports.smallWide[0]}px) and (max-width: ${viewports.smallWide[1]}px)`,
	mediumOnly: `(min-width: ${viewports.medium[0]}px) and (max-width: ${viewports.medium[1]}px)`,
	largeOnly: `(min-width: ${viewports.large[0]}px) and (max-width: ${viewports.large[1]}px)`,
	xlargeOnly: `(min-width: ${viewports.xlarge[0]}px) and (max-width: ${viewports.xlarge[1]}px)`,
	xxlargeOnly: `(min-width: ${viewports.xxlarge[0]}px) and (max-width: ${viewports.xxlarge[1]}px)`,
	xxxlargeOnly: `(min-width: ${viewports.xxxlarge[0]}px)`
}
