#!/bin/sh
if [ -z "" ]; then
  debug () {
    [ "" = "1" ] && echo "husky (debug) - "
  }
  readonly hook_name="zsh""
  debug "starting ..."
  if [ -f ~/.huskyrc ]; then
    debug "sourcing ~/.huskyrc"
    . ~/.huskyrc
  fi
  if [ -f ~/.config/husky/init.sh ]; then
    debug "sourcing ~/.config/husky/init.sh"
    . ~/.config/husky/init.sh
  fi
  export readonly husky_skip_init=1
  sh -e "/bin/zsh" ""
  exit 0
fi
