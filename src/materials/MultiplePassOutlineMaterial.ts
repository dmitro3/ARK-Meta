export default class MultiplePassOutlineMaterial extends Laya.Material {

    private ALBEDOTEXTURE = Laya.Shader3D.propertyNameToID("u_AlbedoTexture");
    private OUTLINECOLOR = Laya.Shader3D.propertyNameToID("u_OutlineColor");
    private OUTLINEWIDTH = Laya.Shader3D.propertyNameToID("u_OutlineWidth");
    private OUTLINELIGHTNESS = Laya.Shader3D.propertyNameToID("u_OutlineLightness");

    static __init__() {
    }

    get albedoTexture() {
        return this._shaderValues.getTexture(this.ALBEDOTEXTURE);
    }


    set albedoTexture(value) {
        this._shaderValues.setTexture(this.ALBEDOTEXTURE, value);
    }

    get outlineColor() {
        return this._shaderValues.getVector(this.OUTLINECOLOR);
    }

    set outlineColor(value) {
        this._shaderValues.setVector(this.OUTLINECOLOR, value);
    }

    get outlineWidth() {
        return this._shaderValues.getNumber(this.OUTLINEWIDTH);
    }

    set outlineWidth(value) {
        value = Math.max(0.0, Math.min(0.05, value));
        this._shaderValues.setNumber(this.OUTLINEWIDTH, value);
    }

    get outlineLightness() {
        return this._shaderValues.getNumber(this.OUTLINELIGHTNESS);
    }

    set outlineLightness(value) {
        value = Math.max(0.0, Math.min(1.0, value));
        this._shaderValues.setNumber(this.OUTLINELIGHTNESS, value);
    }


    static initShader() {
        MultiplePassOutlineMaterial.__init__();
        var attributeMap = {
            'a_Position': Laya.VertexMesh.MESH_POSITION0,
            'a_Normal': Laya.VertexMesh.MESH_NORMAL0,
            'a_Texcoord0': Laya.VertexMesh.MESH_TEXTURECOORDINATE0
        };
        var uniformMap = {
            'u_MvpMatrix': Laya.Shader3D.PERIOD_SPRITE,
            'u_WorldMat': Laya.Shader3D.PERIOD_SPRITE,
            'u_OutlineWidth': Laya.Shader3D.PERIOD_MATERIAL,
            'u_OutlineColor': Laya.Shader3D.PERIOD_MATERIAL,
            'u_OutlineLightness': Laya.Shader3D.PERIOD_MATERIAL,
            'u_AlbedoTexture': Laya.Shader3D.PERIOD_MATERIAL
        };

        var customShader = Laya.Shader3D.add("MultiplePassOutlineShader");
        var subShader = new Laya.SubShader(attributeMap, uniformMap);
        customShader.addSubShader(subShader);

        let vs1 = `
        #if defined(GL_FRAGMENT_PRECISION_HIGH)// 原来的写法会被我们自己的解析流程处理，而我们的解析是不认内置宏的，导致被删掉，所以改成 if defined 了
            precision highp float;
            precision highp int;
        #else
            precision mediump float;
            precision mediump int;
        #endif
        #include \"Lighting.glsl\";
        #include \"LayaUtile.glsl\"
        #include \"Shadow.glsl\";
        
        
        attribute vec4 a_Position;
        
        #ifdef GPU_INSTANCE
            uniform mat4 u_ViewProjection;
        #else
            uniform mat4 u_MvpMatrix;
        #endif
        
        #if defined(DIFFUSEMAP)||defined(THICKNESSMAP)||((defined(DIRECTIONLIGHT)||defined(POINTLIGHT)||defined(SPOTLIGHT))&&(defined(SPECULARMAP)||defined(NORMALMAP)))||(defined(LIGHTMAP)&&defined(UV))
            attribute vec2 a_Texcoord0;
            varying vec2 v_Texcoord0;
        #endif
        
        #if defined(LIGHTMAP)&&defined(UV1)
            attribute vec2 a_Texcoord1;
        #endif
        
        #ifdef LIGHTMAP
            uniform vec4 u_LightmapScaleOffset;
            varying vec2 v_LightMapUV;
        #endif
        
        #ifdef COLOR
            attribute vec4 a_Color;
            varying vec4 v_Color;
        #endif
        
        #ifdef BONE
            const int c_MaxBoneCount = 24;
            attribute vec4 a_BoneIndices;
            attribute vec4 a_BoneWeights;
            uniform mat4 u_Bones[c_MaxBoneCount];
        #endif
        
        attribute vec3 a_Normal;
        varying vec3 v_Normal; 
        
        #if defined(DIRECTIONLIGHT)||defined(POINTLIGHT)||defined(SPOTLIGHT)
            uniform vec3 u_CameraPos;
            varying vec3 v_ViewDir; 
        #endif
        
        #if defined(NORMALMAP)
            attribute vec4 a_Tangent0;
            varying vec3 v_Tangent;
            varying vec3 v_Binormal;
        #endif
        
        #ifdef GPU_INSTANCE
            attribute mat4 a_WorldMat;
        #else
            uniform mat4 u_WorldMat;
        #endif
        
        #if defined(POINTLIGHT)||defined(SPOTLIGHT)||(defined(CALCULATE_SHADOWS)&&defined(SHADOW_CASCADE))||defined(CALCULATE_SPOTSHADOWS)
            varying vec3 v_PositionWorld;
        #endif
        
        #if defined(CALCULATE_SHADOWS)&&!defined(SHADOW_CASCADE)
            varying vec4 v_ShadowCoord;
        #endif
        
        #if defined(CALCULATE_SPOTSHADOWS)//shader中自定义的宏不可用ifdef 必须改成if defined
            varying vec4 v_SpotShadowCoord;
        #endif
        
        uniform vec4 u_TilingOffset;
        
        void main()
        {
            vec4 position;
            #ifdef BONE
                mat4 skinTransform;
                #ifdef SIMPLEBONE
                    float currentPixelPos;
                    #ifdef GPU_INSTANCE
                        currentPixelPos = a_SimpleTextureParams.x+a_SimpleTextureParams.y;
                    #else
                        currentPixelPos = u_SimpleAnimatorParams.x+u_SimpleAnimatorParams.y;
                    #endif
                    float offset = 1.0/u_SimpleAnimatorTextureSize;
                    skinTransform =  loadMatFromTexture(currentPixelPos,int(a_BoneIndices.x),offset) * a_BoneWeights.x;
                    skinTransform += loadMatFromTexture(currentPixelPos,int(a_BoneIndices.y),offset) * a_BoneWeights.y;
                    skinTransform += loadMatFromTexture(currentPixelPos,int(a_BoneIndices.z),offset) * a_BoneWeights.z;
                    skinTransform += loadMatFromTexture(currentPixelPos,int(a_BoneIndices.w),offset) * a_BoneWeights.w;
                #else
                    skinTransform =  u_Bones[int(a_BoneIndices.x)] * a_BoneWeights.x;
                    skinTransform += u_Bones[int(a_BoneIndices.y)] * a_BoneWeights.y;
                    skinTransform += u_Bones[int(a_BoneIndices.z)] * a_BoneWeights.z;
                    skinTransform += u_Bones[int(a_BoneIndices.w)] * a_BoneWeights.w;
                #endif
                    position=skinTransform*a_Position;
            #else
                position=a_Position;
            #endif
                
                
                
            mat4 worldMat;
            #ifdef GPU_INSTANCE
                worldMat = a_WorldMat;
            #else
                worldMat = u_WorldMat;
            #endif

            uniform float u_OutlineWidth;
                    
            #ifdef GPU_INSTANCE
                gl_Position = u_ViewProjection * worldMat * position;
            #else
                position = vec4(a_Position.xyz + a_Normal * u_OutlineWidth, 1.0);
                gl_Position = u_MvpMatrix * position;
            #endif
                    
            mat3 worldInvMat;
            #ifdef BONE
                worldInvMat=INVERSE_MAT(mat3(worldMat*skinTransform));
            #else
                worldInvMat=INVERSE_MAT(mat3(worldMat));
            #endif
                    
            v_Normal=normalize(a_Normal*worldInvMat);
            #if defined(NORMALMAP)
                v_Tangent=normalize(a_Tangent0.xyz*worldInvMat);
                v_Binormal=cross(v_Normal,v_Tangent)*a_Tangent0.w;
            #endif
            
            #if defined(DIRECTIONLIGHT)||defined(POINTLIGHT)||defined(SPOTLIGHT)||(defined(CALCULATE_SHADOWS)&&defined(SHADOW_CASCADE))||defined(CALCULATE_SPOTSHADOWS)
                vec3 positionWS=(worldMat*position).xyz;
            #if defined(DIRECTIONLIGHT)||defined(POINTLIGHT)||defined(SPOTLIGHT)
                v_ViewDir = u_CameraPos-positionWS;
            #endif
            
            #if defined(POINTLIGHT)||defined(SPOTLIGHT)||(defined(CALCULATE_SHADOWS)&&defined(SHADOW_CASCADE))||defined(CALCULATE_SPOTSHADOWS)
                v_PositionWorld = positionWS;
            #endif
            
            #endif
            
            
            #if defined(DIFFUSEMAP)||defined(THICKNESSMAP)||((defined(DIRECTIONLIGHT)||defined(POINTLIGHT)||defined(SPOTLIGHT))&&(defined(SPECULARMAP)||defined(NORMALMAP)))
                v_Texcoord0=TransformUV(a_Texcoord0,u_TilingOffset);
            #endif
            
            #ifdef LIGHTMAP
            #ifdef UV1
                v_LightMapUV=vec2(a_Texcoord1.x,1.0-a_Texcoord1.y)*u_LightmapScaleOffset.xy+u_LightmapScaleOffset.zw;
            #else
                v_LightMapUV=vec2(a_Texcoord0.x,1.0-a_Texcoord0.y)*u_LightmapScaleOffset.xy+u_LightmapScaleOffset.zw;
            #endif
            
            v_LightMapUV.y=1.0-v_LightMapUV.y;
            #endif
            
            #if defined(COLOR)&&defined(ENABLEVERTEXCOLOR)
                v_Color=a_Color;
            #endif
            
            #if defined(CALCULATE_SHADOWS)&&!defined(SHADOW_CASCADE)
                v_ShadowCoord =getShadowCoord(vec4(positionWS,1.0));
            #endif
            
            
            #if defined(CALCULATE_SPOTSHADOWS)//shader中自定义的宏不可用ifdef 必须改成if defined
                v_SpotShadowCoord = u_SpotViewProjectMatrix*vec4(positionWS,1.0);
            #endif
            
            gl_Position=remapGLPositionZ(gl_Position);
        }
        `;

        let ps1 = `
        #ifdef FSHIGHPRECISION
            precision highp float;
        #else
           precision mediump float;
        #endif
        uniform vec4 u_OutlineColor; 
        uniform float u_OutlineLightness;
    
        void main()
        {
           vec3 finalColor = u_OutlineColor.rgb * u_OutlineLightness;
           gl_FragColor = vec4(finalColor,0.0); 
        }`;

        var pass1 = subShader.addShaderPass(vs1, ps1);
        pass1.renderState.cull = Laya.RenderState.CULL_FRONT;
        let vs2 = `
        #include "Lighting.glsl"

        attribute vec4 a_Position; 
        attribute vec2 a_Texcoord0;
        
        uniform mat4 u_MvpMatrix;
        uniform mat4 u_WorldMat;
        
        attribute vec3 a_Normal; 
        varying vec3 v_Normal; 
        varying vec2 v_Texcoord0; 
        
        void main() 
        {
           gl_Position = u_MvpMatrix * a_Position;
           mat3 worldMat=mat3(u_WorldMat); 
           v_Normal=worldMat*a_Normal; 
           v_Texcoord0 = a_Texcoord0;
           gl_Position=remapGLPositionZ(gl_Position); 
        }`;
        let ps2 = `
        #ifdef FSHIGHPRECISION
            precision highp float;
        #else
            precision mediump float;
        #endif
        varying vec2 v_Texcoord0;
        varying vec3 v_Normal;
        
        uniform sampler2D u_AlbedoTexture;
        
        
        void main()
        {
           vec4 albedoTextureColor = vec4(1.0);
           
           albedoTextureColor = texture2D(u_AlbedoTexture, v_Texcoord0);
           gl_FragColor=albedoTextureColor;
        }`;

        subShader.addShaderPass(vs2, ps2);
    }


    constructor() {
        super();
        this.setShaderName("MultiplePassOutlineShader");
        this._shaderValues.setNumber(this.OUTLINEWIDTH, 0.01581197);
        this._shaderValues.setNumber(this.OUTLINELIGHTNESS, 1);
        this._shaderValues.setVector(this.OUTLINECOLOR, new Laya.Vector4(1.0, 1.0, 1.0, 0.0));
    }
}
