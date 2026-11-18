"""Create vendor/ files (three.js 0.149 + OrbitControls + RoomEnvironment as plain scripts).
Usage (from this folder):  npm pack three@0.149.0 && tar xzf three-0.149.0.tgz && python3 prep_three.py"""
import re,os
os.makedirs('../vendor',exist_ok=True)
P='package/'
open('../vendor/three.min.js','w').write(open(P+'build/three.min.js').read())
o=open(P+'examples/jsm/controls/OrbitControls.js').read()
o=re.sub(r"^import \{[^}]*\} from 'three';","const {EventDispatcher,MOUSE,Quaternion,Spherical,TOUCH,Vector2,Vector3}=THREE;",o,count=1,flags=re.S)
o=o.replace("export { OrbitControls, MapControls };","THREE.OrbitControls = OrbitControls;")
e=open(P+'examples/jsm/environments/RoomEnvironment.js').read()
e=re.sub(r"import \{[^}]*\} from 'three';","const {BackSide,BoxGeometry,Mesh,MeshBasicMaterial,MeshStandardMaterial,PointLight,Scene}=THREE;",e,count=1,flags=re.S)
e=e.replace("export { RoomEnvironment };","THREE.RoomEnvironment = RoomEnvironment;")
open('../vendor/orbit.js','w').write(o+'\n'+e)
print('vendor files written')
