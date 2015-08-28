# -*- mode: ruby -*-
# vi: set ft=ruby :

# All Vagrant configuration is done below. The "2" in Vagrant.configure
# configures the configuration version (we support older styles for
# backwards compatibility). Please don't change it unless you know what
# you're doing.
Vagrant.configure(2) do |config|
  config.vm.box = "ubuntu/trusty64"
  config.vm.host_name = "dev.redbud.com"
  config.vm.network "private_network", ip: "192.168.37.10"

  config.vm.provider :virtualbox do |vb|
    vb.name = "redbud-dev"
    vb.customize ["modifyvm", :id, "--memory", "1024"]
  end

  config.vm.network "forwarded_port", guest: 5432, host: 15432

  config.vm.provision :shell, path: "provision-server.sh"
end
