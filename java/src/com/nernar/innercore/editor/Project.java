package com.nernar.innercore.editor;

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
