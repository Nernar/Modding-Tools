var Particles = {};
Particles.addFarParticle = function(id, dx, dy, dz, vx, vy, vz, data) {};
Particles.addParticle = function(id, dx, dy, dz, vx, vy, vz, data) {};
Particles.getParticleTypeById = function(id) {
	return {
    	getId: function() {},
    	setAnimator: function(str, ParticleAnimator) {},
    	setCollisionParams: function(bool1, bool2, number) {},
    	setColor: function(float1, float2, float3, float4, optFloat5, optFloat6, optFloat7, optFloat8) {},
    	setDefaultAcceleration: function(x, y, z) {},
    	setDefaultVelocity: function(x, y, z) {},
    	setFriction: function(float1, float2) {},
    	setLifetime: function(int1, int2) {},
    	setRebuildDelay: function(number) {},
    	setRenderType: function(number) {},
    	setSize: function(float1, float2) {},
    	setSubEmitter: function(str, subEmitter) {}
	};
};
Particles.registerParticleType = function(scope) {};
