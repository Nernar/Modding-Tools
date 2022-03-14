/*

   Copyright 2022 Nernar (github.com/nernar)
   
   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at
   
       http://www.apache.org/licenses/LICENSE-2.0
   
   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.

*/
package io.nernar.innercore.editor;

public class Project {
    private String name;
    private String author;
    private int version;
    private int[] dependencies;
    private Submodule submodule;
    
    public void setName(String name) {
        this.name = name;
    }
    
    public String getName() {
        return name;
    }
    
    public void setAuthor(String author) {
        this.author = author;
    }
    
    public String getAuthor() {
        return author;
    }
    
    public void setVersion(int version) {
        this.version = version;
    }
    
    public int getVersion() {
        return version;
    }
    
    public void setDependencies(int... dependencies) {
        this.dependencies = dependencies;
    }
    
    public int[] getDependencies() {
        return dependencies;
    }
    
    public void setSubmodule(Submodule submodule) {
        this.submodule = submodule;
    }
    
    public Submodule getSubmodule() {
        return submodule;
    }
    
    public static class Submodule {
        private boolean enabled;
        
        public void setEnabled(boolean enabled) {
            this.enabled = enabled;
        }
        
        public boolean isEnabled() {
            return enabled;
        }
    }
}
