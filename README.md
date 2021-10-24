# Restocker
## Summary
_v0.1_

Restocker is a web app made using React for tracking inventory and stock.

## Registration

New users can register via the landing page.

### Organisation

When registering users must select their organisation, or add a new one if it does not exist. The first user to register a new organisation will automatically be made a super admin and be automatically approved.

### Verification

When they register, users will be sent a verficication email. Unitl they click the link in the verification email they will not be able to log in. Organisation admins can manually verify users on their behalf if needed.

### Approval

Users will need to be approved by an organisational admin before they can log in. This does not apply to the first user of an organiation, as they are a super admin by default and automatically approved.

### Suspended users

Admins (see below) can suspend a user, meaning they will be unable to login until they are reinstated.

## Admins

There are two types of admin roles a user can be - "Admin" or "Super admin".

### Admins

Admins can verify, approve and suspend other users. They can also make changes to the item settings for the organisation.

### Super admins

Super admins have all the rights of normal admins, but can also promote users to admin roles or revert admins back to being normal users. A super admin can promote an admin to suler admin, but cannot change the status of a super admin once promoted.

A super admin can only be emoved by renouncing their super admin rights or by a system administator.
