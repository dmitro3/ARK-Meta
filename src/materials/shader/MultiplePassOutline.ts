import MultiplePassOutlineMaterial from "../MultiplePassOutlineMaterial";


export default class MultiplePassOutline {

    public static initShader() {
        MultiplePassOutlineMaterial.__init__();

        var attributeMap = {
            'a_Position': Laya.VertexMesh.MESH_POSITION0,
            'a_Color': Laya.VertexMesh.MESH_COLOR0,
            'a_Normal': Laya.VertexMesh.MESH_NORMAL0,
            'a_Texcoord0': Laya.VertexMesh.MESH_TEXTURECOORDINATE0,
            'a_Texcoord1': Laya.VertexMesh.MESH_TEXTURECOORDINATE1,
            'a_BoneWeights': Laya.VertexMesh.MESH_BLENDWEIGHT0,
            'a_BoneIndices': Laya.VertexMesh.MESH_BLENDINDICES0,
            'a_Tangent0': Laya.VertexMesh.MESH_TANGENT0,
            'a_WorldMat': Laya.VertexMesh.MESH_WORLDMATRIX_ROW0,
            'a_SimpleTextureParams': Laya.VertexMesh.MESH_SIMPLEANIMATOR
        };

        var uniformMap = {
            'u_Bones': Laya.Shader3D.PERIOD_CUSTOM,
            'u_DiffuseTexture': Laya.Shader3D.PERIOD_MATERIAL,
            'u_SpecularTexture': Laya.Shader3D.PERIOD_MATERIAL,
            'u_NormalTexture': Laya.Shader3D.PERIOD_MATERIAL,
            'u_AlphaTestValue': Laya.Shader3D.PERIOD_MATERIAL,
            'u_DiffuseColor': Laya.Shader3D.PERIOD_MATERIAL,
            'u_AlbedoIntensity': Laya.Shader3D.PERIOD_MATERIAL,
            'u_MaterialSpecular': Laya.Shader3D.PERIOD_MATERIAL,
            'u_Shininess': Laya.Shader3D.PERIOD_MATERIAL,
            'u_TilingOffset': Laya.Shader3D.PERIOD_MATERIAL,
            'u_TransmissionRate': Laya.Shader3D.PERIOD_MATERIAL,
            'u_BackDiffuse': Laya.Shader3D.PERIOD_MATERIAL,
            'u_BackScale': Laya.Shader3D.PERIOD_MATERIAL,
            'u_ThinknessTexture': Laya.Shader3D.PERIOD_MATERIAL,
            'u_TransmissionColor': Laya.Shader3D.PERIOD_MATERIAL,
            'u_WorldMat': Laya.Shader3D.PERIOD_SPRITE,
            'u_MvpMatrix': Laya.Shader3D.PERIOD_SPRITE,
            'u_LightmapScaleOffset': Laya.Shader3D.PERIOD_SPRITE,
            'u_LightMap': Laya.Shader3D.PERIOD_SPRITE,
            'u_LightMapDirection': Laya.Shader3D.PERIOD_SPRITE,
            'u_SimpleAnimatorTexture': Laya.Shader3D.PERIOD_SPRITE,
            'u_SimpleAnimatorParams': Laya.Shader3D.PERIOD_SPRITE,
            'u_SimpleAnimatorTextureSize': Laya.Shader3D.PERIOD_SPRITE,
            'u_CameraPos': Laya.Shader3D.PERIOD_CAMERA,
            'u_Viewport': Laya.Shader3D.PERIOD_CAMERA,
            'u_ProjectionParams': Laya.Shader3D.PERIOD_CAMERA,
            'u_View': Laya.Shader3D.PERIOD_CAMERA,
            'u_ViewProjection': Laya.Shader3D.PERIOD_CAMERA,
            'u_ReflectTexture': Laya.Shader3D.PERIOD_SCENE,
            'u_FogStart': Laya.Shader3D.PERIOD_SCENE,
            'u_FogRange': Laya.Shader3D.PERIOD_SCENE,
            'u_FogColor': Laya.Shader3D.PERIOD_SCENE,
            'u_DirationLightCount': Laya.Shader3D.PERIOD_SCENE,
            'u_LightBuffer': Laya.Shader3D.PERIOD_SCENE,
            'u_LightClusterBuffer': Laya.Shader3D.PERIOD_SCENE,
            'u_AmbientColor': Laya.Shader3D.PERIOD_SCENE,
            'u_ShadowBias': Laya.Shader3D.PERIOD_SCENE,
            'u_ShadowLightDirection': Laya.Shader3D.PERIOD_SCENE,
            'u_ShadowMap': Laya.Shader3D.PERIOD_SCENE,
            'u_ShadowParams': Laya.Shader3D.PERIOD_SCENE,
            'u_ShadowSplitSpheres': Laya.Shader3D.PERIOD_SCENE,
            'u_ShadowMatrices': Laya.Shader3D.PERIOD_SCENE,
            'u_ShadowMapSize': Laya.Shader3D.PERIOD_SCENE,
            'u_SpotShadowMap': Laya.Shader3D.PERIOD_SCENE,
            'u_SpotViewProjectMatrix': Laya.Shader3D.PERIOD_SCENE,
            'u_ShadowLightPosition': Laya.Shader3D.PERIOD_SCENE,
            'u_AmbientSHAr': Laya.Shader3D.PERIOD_SCENE,
            'u_AmbientSHAg': Laya.Shader3D.PERIOD_SCENE,
            'u_AmbientSHAb': Laya.Shader3D.PERIOD_SCENE,
            'u_AmbientSHBr': Laya.Shader3D.PERIOD_SCENE,
            'u_AmbientSHBg': Laya.Shader3D.PERIOD_SCENE,
            'u_AmbientSHBb': Laya.Shader3D.PERIOD_SCENE,
            'u_AmbientSHC': Laya.Shader3D.PERIOD_SCENE,
            'u_DirectionLight.color': Laya.Shader3D.PERIOD_SCENE,
            'u_DirectionLight.direction': Laya.Shader3D.PERIOD_SCENE,
            'u_PointLight.position': Laya.Shader3D.PERIOD_SCENE,
            'u_PointLight.range': Laya.Shader3D.PERIOD_SCENE,
            'u_PointLight.color': Laya.Shader3D.PERIOD_SCENE,
            'u_SpotLight.position': Laya.Shader3D.PERIOD_SCENE,
            'u_SpotLight.direction': Laya.Shader3D.PERIOD_SCENE,
            'u_SpotLight.range': Laya.Shader3D.PERIOD_SCENE,
            'u_SpotLight.spot': Laya.Shader3D.PERIOD_SCENE,
            'u_SpotLight.color': Laya.Shader3D.PERIOD_SCENE
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
                    
            #ifdef GPU_INSTANCE
                gl_Position = u_ViewProjection * worldMat * position;
            #else
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
        #if defined(GL_FRAGMENT_PRECISION_HIGH)// 原来的写法会被我们自己的解析流程处理，而我们的解析是不认内置宏的，导致被删掉，所以改成 if defined 了
            precision highp float;
            precision highp int;
        #else
            precision mediump float;
            precision mediump int;
        #endif
        
        #include \"ShadowCasterFS.glsl\"
        
        void main()
        {
            gl_FragColor=shadowCasterFragment();
        }
        `

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
}