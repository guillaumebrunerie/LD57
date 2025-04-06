import { Filter, GlProgram, type Texture } from "pixi.js";

const vertex = `
in vec2 aPosition;
out vec2 vTextureCoord;

uniform vec4 uInputSize;
uniform vec4 uOutputFrame;
uniform vec4 uOutputTexture;

vec4 filterVertexPosition( void )
{
    vec2 position = aPosition * uOutputFrame.zw + uOutputFrame.xy;
    
    position.x = position.x * (2.0 / uOutputTexture.x) - 1.0;
    position.y = position.y * (2.0*uOutputTexture.z / uOutputTexture.y) - uOutputTexture.z;

return vec4(position, 0.0, 1.0);
}

vec2 filterTextureCoord( void )
{
    return aPosition * (uOutputFrame.zw * uInputSize.zw);
}

void main(void)
{
    gl_Position = filterVertexPosition();
    vTextureCoord = filterTextureCoord();
}
`;

const fragment = `
  in vec2 vTextureCoord;
  out vec4 finalColor;

// uniform vec4 uInputSize;
// uniform vec4 uOutputFrame;
// uniform vec4 uOutputTexture;

// vec2 filterTextureCoord( void )
// {
//     return vTextureCoord * uOutputFrame.zw / vec2(1920.0, 1920.0); // * (uOutputFrame.zw * uInputSize.zw);
// }

  uniform sampler2D uTexture1;
  uniform sampler2D uTexture2;

  void main(void) {
    float blendFactor = vTextureCoord.y; // 0 at top, 1 at bottom
    vec4 color1 = texture2D(uTexture1, vTextureCoord);
    vec4 color2 = texture2D(uTexture2, vTextureCoord);
    gl_FragColor = mix(color1, color2, blendFactor);
  }
`;

export const crossfadeFilter = (texture1: Texture, texture2: Texture) => {
	return new Filter({
		glProgram: GlProgram.from({ fragment, vertex }),
		// resources: {
		// 	timeUniforms: {
		// 		uTime: { value: 0.0, type: "f32" },
		// 	},
		// },
		resources: {
			uTexture1: texture1.source,
			uTexture2: texture2.source,
		},
	});
};
