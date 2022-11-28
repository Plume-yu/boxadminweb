# Generated by the protocol buffer compiler.  DO NOT EDIT!

from google.protobuf import descriptor
from google.protobuf import message
from google.protobuf import reflection
from google.protobuf import service
from google.protobuf import service_reflection
from google.protobuf import descriptor_pb2


_OPMSG_JOBTYPE = descriptor.EnumDescriptor(
  name='JobType',
  full_name='proto_oparb.opmsg.JobType',
  filename='JobType',
  values=[
    descriptor.EnumValueDescriptor(
      name='REQUEST', index=0, number=1,
      options=None,
      type=None),
    descriptor.EnumValueDescriptor(
      name='RESPONSE', index=1, number=2,
      options=None,
      type=None),
  ],
  options=None,
)

_OPMSG_EXECTYPE = descriptor.EnumDescriptor(
  name='ExecType',
  full_name='proto_oparb.opmsg.ExecType',
  filename='ExecType',
  values=[
    descriptor.EnumValueDescriptor(
      name='EXECUTE', index=0, number=1,
      options=None,
      type=None),
    descriptor.EnumValueDescriptor(
      name='CAST', index=1, number=2,
      options=None,
      type=None),
  ],
  options=None,
)

_KICKUSERANS_RESULT_TYPE = descriptor.EnumDescriptor(
  name='result_type',
  full_name='proto_oparb.KickUserAns.result_type',
  filename='result_type',
  values=[
    descriptor.EnumValueDescriptor(
      name='SUCCESS', index=0, number=0,
      options=None,
      type=None),
    descriptor.EnumValueDescriptor(
      name='FAILED', index=1, number=1,
      options=None,
      type=None),
    descriptor.EnumValueDescriptor(
      name='NOT_EXIST', index=2, number=2,
      options=None,
      type=None),
  ],
  options=None,
)

_SENDMESSAGEANS_RESULT_TYPE = descriptor.EnumDescriptor(
  name='result_type',
  full_name='proto_oparb.SendMessageAns.result_type',
  filename='result_type',
  values=[
    descriptor.EnumValueDescriptor(
      name='SUCCESS', index=0, number=0,
      options=None,
      type=None),
    descriptor.EnumValueDescriptor(
      name='FAILED', index=1, number=1,
      options=None,
      type=None),
    descriptor.EnumValueDescriptor(
      name='NOT_EXIST', index=2, number=2,
      options=None,
      type=None),
  ],
  options=None,
)

_DENIEDCHATUSERANS_RESULT_TYPE = descriptor.EnumDescriptor(
  name='result_type',
  full_name='proto_oparb.DeniedChatUserAns.result_type',
  filename='result_type',
  values=[
    descriptor.EnumValueDescriptor(
      name='SUCCESS', index=0, number=0,
      options=None,
      type=None),
    descriptor.EnumValueDescriptor(
      name='FAILED', index=1, number=1,
      options=None,
      type=None),
    descriptor.EnumValueDescriptor(
      name='NOT_EXIST', index=2, number=2,
      options=None,
      type=None),
  ],
  options=None,
)

_ADDREMAININGMINANS_RESULT_TYPE = descriptor.EnumDescriptor(
  name='result_type',
  full_name='proto_oparb.AddRemainingMinAns.result_type',
  filename='result_type',
  values=[
    descriptor.EnumValueDescriptor(
      name='SUCCESS', index=0, number=0,
      options=None,
      type=None),
    descriptor.EnumValueDescriptor(
      name='FAILED', index=1, number=1,
      options=None,
      type=None),
    descriptor.EnumValueDescriptor(
      name='NOT_EXIST', index=2, number=2,
      options=None,
      type=None),
  ],
  options=None,
)

_BOXNOTIUSERANS_RESULT_TYPE = descriptor.EnumDescriptor(
  name='result_type',
  full_name='proto_oparb.BoxNotiUserAns.result_type',
  filename='result_type',
  values=[
    descriptor.EnumValueDescriptor(
      name='SUCCESS', index=0, number=0,
      options=None,
      type=None),
    descriptor.EnumValueDescriptor(
      name='FAILED', index=1, number=1,
      options=None,
      type=None),
    descriptor.EnumValueDescriptor(
      name='NOT_EXIST', index=2, number=2,
      options=None,
      type=None),
  ],
  options=None,
)

_CHARNAMEBANANS_RESULT_TYPE = descriptor.EnumDescriptor(
  name='result_type',
  full_name='proto_oparb.CharNameBanAns.result_type',
  filename='result_type',
  values=[
    descriptor.EnumValueDescriptor(
      name='SUCCESS', index=0, number=0,
      options=None,
      type=None),
    descriptor.EnumValueDescriptor(
      name='FAILED', index=1, number=1,
      options=None,
      type=None),
    descriptor.EnumValueDescriptor(
      name='NOT_EXIST', index=2, number=2,
      options=None,
      type=None),
  ],
  options=None,
)

_GUILDNAMEBANANS_RESULT_TYPE = descriptor.EnumDescriptor(
  name='result_type',
  full_name='proto_oparb.GuildNameBanAns.result_type',
  filename='result_type',
  values=[
    descriptor.EnumValueDescriptor(
      name='SUCCESS', index=0, number=0,
      options=None,
      type=None),
    descriptor.EnumValueDescriptor(
      name='FAILED', index=1, number=1,
      options=None,
      type=None),
    descriptor.EnumValueDescriptor(
      name='NOT_EXIST', index=2, number=2,
      options=None,
      type=None),
  ],
  options=None,
)


_OPMSG_ARGUMENT = descriptor.Descriptor(
  name='Argument',
  full_name='proto_oparb.opmsg.Argument',
  filename='OpArb.proto',
  containing_type=None,
  fields=[
    descriptor.FieldDescriptor(
      name='name', full_name='proto_oparb.opmsg.Argument.name', index=0,
      number=1, type=12, cpp_type=9, label=1,
      default_value="",
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      options=None),
    descriptor.FieldDescriptor(
      name='value', full_name='proto_oparb.opmsg.Argument.value', index=1,
      number=2, type=12, cpp_type=9, label=2,
      default_value="",
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      options=None),
  ],
  extensions=[
  ],
  nested_types=[],  # TODO(robinson): Implement.
  enum_types=[
  ],
  options=None)

_OPMSG_RESULTSET_ROW = descriptor.Descriptor(
  name='Row',
  full_name='proto_oparb.opmsg.ResultSet.Row',
  filename='OpArb.proto',
  containing_type=None,
  fields=[
    descriptor.FieldDescriptor(
      name='values', full_name='proto_oparb.opmsg.ResultSet.Row.values', index=0,
      number=1, type=12, cpp_type=9, label=3,
      default_value=[],
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      options=None),
  ],
  extensions=[
  ],
  nested_types=[],  # TODO(robinson): Implement.
  enum_types=[
  ],
  options=None)

_OPMSG_RESULTSET = descriptor.Descriptor(
  name='ResultSet',
  full_name='proto_oparb.opmsg.ResultSet',
  filename='OpArb.proto',
  containing_type=None,
  fields=[
    descriptor.FieldDescriptor(
      name='column_names', full_name='proto_oparb.opmsg.ResultSet.column_names', index=0,
      number=1, type=12, cpp_type=9, label=3,
      default_value=[],
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      options=None),
    descriptor.FieldDescriptor(
      name='rows', full_name='proto_oparb.opmsg.ResultSet.rows', index=1,
      number=2, type=11, cpp_type=10, label=3,
      default_value=[],
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      options=None),
    descriptor.FieldDescriptor(
      name='total_count', full_name='proto_oparb.opmsg.ResultSet.total_count', index=2,
      number=3, type=7, cpp_type=3, label=1,
      default_value=0,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      options=None),
  ],
  extensions=[
  ],
  nested_types=[],  # TODO(robinson): Implement.
  enum_types=[
  ],
  options=None)

_OPMSG = descriptor.Descriptor(
  name='opmsg',
  full_name='proto_oparb.opmsg',
  filename='OpArb.proto',
  containing_type=None,
  fields=[
    descriptor.FieldDescriptor(
      name='sender_gusid', full_name='proto_oparb.opmsg.sender_gusid', index=0,
      number=1, type=7, cpp_type=3, label=1,
      default_value=0,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      options=None),
    descriptor.FieldDescriptor(
      name='receiver_gusid', full_name='proto_oparb.opmsg.receiver_gusid', index=1,
      number=2, type=7, cpp_type=3, label=1,
      default_value=0,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      options=None),
    descriptor.FieldDescriptor(
      name='job_type', full_name='proto_oparb.opmsg.job_type', index=2,
      number=3, type=14, cpp_type=8, label=1,
      default_value=1,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      options=None),
    descriptor.FieldDescriptor(
      name='job_id', full_name='proto_oparb.opmsg.job_id', index=3,
      number=4, type=6, cpp_type=4, label=1,
      default_value=0,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      options=None),
    descriptor.FieldDescriptor(
      name='gufid', full_name='proto_oparb.opmsg.gufid', index=4,
      number=5, type=7, cpp_type=3, label=1,
      default_value=0,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      options=None),
    descriptor.FieldDescriptor(
      name='exec_type', full_name='proto_oparb.opmsg.exec_type', index=5,
      number=6, type=14, cpp_type=8, label=1,
      default_value=1,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      options=None),
    descriptor.FieldDescriptor(
      name='cast_target_user_group_sn', full_name='proto_oparb.opmsg.cast_target_user_group_sn', index=6,
      number=7, type=7, cpp_type=3, label=1,
      default_value=0,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      options=None),
    descriptor.FieldDescriptor(
      name='session_key', full_name='proto_oparb.opmsg.session_key', index=7,
      number=8, type=12, cpp_type=9, label=1,
      default_value="",
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      options=None),
    descriptor.FieldDescriptor(
      name='arguments', full_name='proto_oparb.opmsg.arguments', index=8,
      number=9, type=11, cpp_type=10, label=3,
      default_value=[],
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      options=None),
    descriptor.FieldDescriptor(
      name='result_code', full_name='proto_oparb.opmsg.result_code', index=9,
      number=10, type=7, cpp_type=3, label=1,
      default_value=0,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      options=None),
    descriptor.FieldDescriptor(
      name='result_scalar', full_name='proto_oparb.opmsg.result_scalar', index=10,
      number=11, type=12, cpp_type=9, label=1,
      default_value="",
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      options=None),
    descriptor.FieldDescriptor(
      name='result_sets', full_name='proto_oparb.opmsg.result_sets', index=11,
      number=12, type=11, cpp_type=10, label=3,
      default_value=[],
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      options=None),
    descriptor.FieldDescriptor(
      name='blob', full_name='proto_oparb.opmsg.blob', index=12,
      number=13, type=12, cpp_type=9, label=1,
      default_value="",
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      options=None),
  ],
  extensions=[
  ],
  nested_types=[],  # TODO(robinson): Implement.
  enum_types=[
    _OPMSG_JOBTYPE,
    _OPMSG_EXECTYPE,
  ],
  options=None)


_KICKUSERREQ = descriptor.Descriptor(
  name='KickUserReq',
  full_name='proto_oparb.KickUserReq',
  filename='OpArb.proto',
  containing_type=None,
  fields=[
    descriptor.FieldDescriptor(
      name='user_srl', full_name='proto_oparb.KickUserReq.user_srl', index=0,
      number=1, type=6, cpp_type=4, label=2,
      default_value=0,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      options=None),
    descriptor.FieldDescriptor(
      name='kick_code', full_name='proto_oparb.KickUserReq.kick_code', index=1,
      number=2, type=7, cpp_type=3, label=2,
      default_value=0,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      options=None),
  ],
  extensions=[
  ],
  nested_types=[],  # TODO(robinson): Implement.
  enum_types=[
  ],
  options=None)


_KICKUSERANS = descriptor.Descriptor(
  name='KickUserAns',
  full_name='proto_oparb.KickUserAns',
  filename='OpArb.proto',
  containing_type=None,
  fields=[
    descriptor.FieldDescriptor(
      name='result', full_name='proto_oparb.KickUserAns.result', index=0,
      number=1, type=14, cpp_type=8, label=2,
      default_value=0,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      options=None),
  ],
  extensions=[
  ],
  nested_types=[],  # TODO(robinson): Implement.
  enum_types=[
    _KICKUSERANS_RESULT_TYPE,
  ],
  options=None)


_SENDMESSAGEREQ = descriptor.Descriptor(
  name='SendMessageReq',
  full_name='proto_oparb.SendMessageReq',
  filename='OpArb.proto',
  containing_type=None,
  fields=[
    descriptor.FieldDescriptor(
      name='user_srl', full_name='proto_oparb.SendMessageReq.user_srl', index=0,
      number=1, type=6, cpp_type=4, label=2,
      default_value=0,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      options=None),
    descriptor.FieldDescriptor(
      name='message', full_name='proto_oparb.SendMessageReq.message', index=1,
      number=2, type=12, cpp_type=9, label=2,
      default_value="",
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      options=None),
  ],
  extensions=[
  ],
  nested_types=[],  # TODO(robinson): Implement.
  enum_types=[
  ],
  options=None)


_SENDMESSAGEANS = descriptor.Descriptor(
  name='SendMessageAns',
  full_name='proto_oparb.SendMessageAns',
  filename='OpArb.proto',
  containing_type=None,
  fields=[
    descriptor.FieldDescriptor(
      name='result', full_name='proto_oparb.SendMessageAns.result', index=0,
      number=1, type=14, cpp_type=8, label=2,
      default_value=0,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      options=None),
  ],
  extensions=[
  ],
  nested_types=[],  # TODO(robinson): Implement.
  enum_types=[
    _SENDMESSAGEANS_RESULT_TYPE,
  ],
  options=None)


_BULKKICKREQ = descriptor.Descriptor(
  name='BulkKickReq',
  full_name='proto_oparb.BulkKickReq',
  filename='OpArb.proto',
  containing_type=None,
  fields=[
    descriptor.FieldDescriptor(
      name='kick_code', full_name='proto_oparb.BulkKickReq.kick_code', index=0,
      number=1, type=7, cpp_type=3, label=2,
      default_value=0,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      options=None),
    descriptor.FieldDescriptor(
      name='filter', full_name='proto_oparb.BulkKickReq.filter', index=1,
      number=2, type=7, cpp_type=3, label=2,
      default_value=0,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      options=None),
    descriptor.FieldDescriptor(
      name='filter_mask', full_name='proto_oparb.BulkKickReq.filter_mask', index=2,
      number=3, type=7, cpp_type=3, label=2,
      default_value=0,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      options=None),
  ],
  extensions=[
  ],
  nested_types=[],  # TODO(robinson): Implement.
  enum_types=[
  ],
  options=None)


_BULKKICKANS = descriptor.Descriptor(
  name='BulkKickAns',
  full_name='proto_oparb.BulkKickAns',
  filename='OpArb.proto',
  containing_type=None,
  fields=[
    descriptor.FieldDescriptor(
      name='user_cnt', full_name='proto_oparb.BulkKickAns.user_cnt', index=0,
      number=1, type=7, cpp_type=3, label=2,
      default_value=0,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      options=None),
  ],
  extensions=[
  ],
  nested_types=[],  # TODO(robinson): Implement.
  enum_types=[
  ],
  options=None)


_DENIEDCHATUSERREQ = descriptor.Descriptor(
  name='DeniedChatUserReq',
  full_name='proto_oparb.DeniedChatUserReq',
  filename='OpArb.proto',
  containing_type=None,
  fields=[
    descriptor.FieldDescriptor(
      name='user_srl', full_name='proto_oparb.DeniedChatUserReq.user_srl', index=0,
      number=1, type=6, cpp_type=4, label=2,
      default_value=0,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      options=None),
    descriptor.FieldDescriptor(
      name='end_datetime', full_name='proto_oparb.DeniedChatUserReq.end_datetime', index=1,
      number=2, type=7, cpp_type=3, label=2,
      default_value=0,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      options=None),
  ],
  extensions=[
  ],
  nested_types=[],  # TODO(robinson): Implement.
  enum_types=[
  ],
  options=None)


_DENIEDCHATUSERANS = descriptor.Descriptor(
  name='DeniedChatUserAns',
  full_name='proto_oparb.DeniedChatUserAns',
  filename='OpArb.proto',
  containing_type=None,
  fields=[
    descriptor.FieldDescriptor(
      name='result', full_name='proto_oparb.DeniedChatUserAns.result', index=0,
      number=1, type=14, cpp_type=8, label=2,
      default_value=0,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      options=None),
  ],
  extensions=[
  ],
  nested_types=[],  # TODO(robinson): Implement.
  enum_types=[
    _DENIEDCHATUSERANS_RESULT_TYPE,
  ],
  options=None)


_ADDREMAININGMINREQ = descriptor.Descriptor(
  name='AddRemainingMinReq',
  full_name='proto_oparb.AddRemainingMinReq',
  filename='OpArb.proto',
  containing_type=None,
  fields=[
    descriptor.FieldDescriptor(
      name='user_srl', full_name='proto_oparb.AddRemainingMinReq.user_srl', index=0,
      number=1, type=6, cpp_type=4, label=2,
      default_value=0,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      options=None),
    descriptor.FieldDescriptor(
      name='remaining_min', full_name='proto_oparb.AddRemainingMinReq.remaining_min', index=1,
      number=2, type=7, cpp_type=3, label=2,
      default_value=0,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      options=None),
  ],
  extensions=[
  ],
  nested_types=[],  # TODO(robinson): Implement.
  enum_types=[
  ],
  options=None)


_ADDREMAININGMINANS = descriptor.Descriptor(
  name='AddRemainingMinAns',
  full_name='proto_oparb.AddRemainingMinAns',
  filename='OpArb.proto',
  containing_type=None,
  fields=[
    descriptor.FieldDescriptor(
      name='result', full_name='proto_oparb.AddRemainingMinAns.result', index=0,
      number=1, type=14, cpp_type=8, label=2,
      default_value=0,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      options=None),
  ],
  extensions=[
  ],
  nested_types=[],  # TODO(robinson): Implement.
  enum_types=[
    _ADDREMAININGMINANS_RESULT_TYPE,
  ],
  options=None)


_PINGREQ = descriptor.Descriptor(
  name='PingReq',
  full_name='proto_oparb.PingReq',
  filename='OpArb.proto',
  containing_type=None,
  fields=[
  ],
  extensions=[
  ],
  nested_types=[],  # TODO(robinson): Implement.
  enum_types=[
  ],
  options=None)


_PINGANS = descriptor.Descriptor(
  name='PingAns',
  full_name='proto_oparb.PingAns',
  filename='OpArb.proto',
  containing_type=None,
  fields=[
    descriptor.FieldDescriptor(
      name='time', full_name='proto_oparb.PingAns.time', index=0,
      number=1, type=7, cpp_type=3, label=2,
      default_value=0,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      options=None),
    descriptor.FieldDescriptor(
      name='value1', full_name='proto_oparb.PingAns.value1', index=1,
      number=2, type=7, cpp_type=3, label=2,
      default_value=0,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      options=None),
    descriptor.FieldDescriptor(
      name='value2', full_name='proto_oparb.PingAns.value2', index=2,
      number=3, type=7, cpp_type=3, label=2,
      default_value=0,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      options=None),
    descriptor.FieldDescriptor(
      name='opt_values', full_name='proto_oparb.PingAns.opt_values', index=3,
      number=4, type=7, cpp_type=3, label=3,
      default_value=[],
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      options=None),
  ],
  extensions=[
  ],
  nested_types=[],  # TODO(robinson): Implement.
  enum_types=[
  ],
  options=None)


_UPDATESERVERSTATNOTI = descriptor.Descriptor(
  name='UpdateServerStatNoti',
  full_name='proto_oparb.UpdateServerStatNoti',
  filename='OpArb.proto',
  containing_type=None,
  fields=[
  ],
  extensions=[
  ],
  nested_types=[],  # TODO(robinson): Implement.
  enum_types=[
  ],
  options=None)


_BOXNOTIUSERREQ = descriptor.Descriptor(
  name='BoxNotiUserReq',
  full_name='proto_oparb.BoxNotiUserReq',
  filename='OpArb.proto',
  containing_type=None,
  fields=[
    descriptor.FieldDescriptor(
      name='user_srl', full_name='proto_oparb.BoxNotiUserReq.user_srl', index=0,
      number=1, type=6, cpp_type=4, label=2,
      default_value=0,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      options=None),
    descriptor.FieldDescriptor(
      name='char_srl', full_name='proto_oparb.BoxNotiUserReq.char_srl', index=1,
      number=2, type=7, cpp_type=3, label=2,
      default_value=0,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      options=None),
  ],
  extensions=[
  ],
  nested_types=[],  # TODO(robinson): Implement.
  enum_types=[
  ],
  options=None)


_BOXNOTIUSERANS = descriptor.Descriptor(
  name='BoxNotiUserAns',
  full_name='proto_oparb.BoxNotiUserAns',
  filename='OpArb.proto',
  containing_type=None,
  fields=[
    descriptor.FieldDescriptor(
      name='result', full_name='proto_oparb.BoxNotiUserAns.result', index=0,
      number=1, type=14, cpp_type=8, label=2,
      default_value=0,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      options=None),
  ],
  extensions=[
  ],
  nested_types=[],  # TODO(robinson): Implement.
  enum_types=[
    _BOXNOTIUSERANS_RESULT_TYPE,
  ],
  options=None)


_SVRMSGREQ = descriptor.Descriptor(
  name='SvrMsgReq',
  full_name='proto_oparb.SvrMsgReq',
  filename='OpArb.proto',
  containing_type=None,
  fields=[
    descriptor.FieldDescriptor(
      name='contents', full_name='proto_oparb.SvrMsgReq.contents', index=0,
      number=2, type=12, cpp_type=9, label=2,
      default_value="",
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      options=None),
  ],
  extensions=[
  ],
  nested_types=[],  # TODO(robinson): Implement.
  enum_types=[
  ],
  options=None)


_SVRMSGANS = descriptor.Descriptor(
  name='SvrMsgAns',
  full_name='proto_oparb.SvrMsgAns',
  filename='OpArb.proto',
  containing_type=None,
  fields=[
    descriptor.FieldDescriptor(
      name='result', full_name='proto_oparb.SvrMsgAns.result', index=0,
      number=1, type=8, cpp_type=7, label=2,
      default_value=False,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      options=None),
  ],
  extensions=[
  ],
  nested_types=[],  # TODO(robinson): Implement.
  enum_types=[
  ],
  options=None)


_CHARTRANSQUERYREQ = descriptor.Descriptor(
  name='CharTransQueryReq',
  full_name='proto_oparb.CharTransQueryReq',
  filename='OpArb.proto',
  containing_type=None,
  fields=[
    descriptor.FieldDescriptor(
      name='char_srl', full_name='proto_oparb.CharTransQueryReq.char_srl', index=0,
      number=1, type=7, cpp_type=3, label=2,
      default_value=0,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      options=None),
  ],
  extensions=[
  ],
  nested_types=[],  # TODO(robinson): Implement.
  enum_types=[
  ],
  options=None)


_CHARTRANSQUERYANS = descriptor.Descriptor(
  name='CharTransQueryAns',
  full_name='proto_oparb.CharTransQueryAns',
  filename='OpArb.proto',
  containing_type=None,
  fields=[
    descriptor.FieldDescriptor(
      name='money', full_name='proto_oparb.CharTransQueryAns.money', index=0,
      number=1, type=6, cpp_type=4, label=2,
      default_value=0,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      options=None),
    descriptor.FieldDescriptor(
      name='level', full_name='proto_oparb.CharTransQueryAns.level', index=1,
      number=2, type=7, cpp_type=3, label=2,
      default_value=0,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      options=None),
    descriptor.FieldDescriptor(
      name='code', full_name='proto_oparb.CharTransQueryAns.code', index=2,
      number=3, type=7, cpp_type=3, label=2,
      default_value=0,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      options=None),
  ],
  extensions=[
  ],
  nested_types=[],  # TODO(robinson): Implement.
  enum_types=[
  ],
  options=None)


_CHARTRANSEXECREQ = descriptor.Descriptor(
  name='CharTransExecReq',
  full_name='proto_oparb.CharTransExecReq',
  filename='OpArb.proto',
  containing_type=None,
  fields=[
    descriptor.FieldDescriptor(
      name='char_srl', full_name='proto_oparb.CharTransExecReq.char_srl', index=0,
      number=1, type=7, cpp_type=3, label=2,
      default_value=0,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      options=None),
    descriptor.FieldDescriptor(
      name='dest_arb', full_name='proto_oparb.CharTransExecReq.dest_arb', index=1,
      number=2, type=7, cpp_type=3, label=2,
      default_value=0,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      options=None),
    descriptor.FieldDescriptor(
      name='money_max', full_name='proto_oparb.CharTransExecReq.money_max', index=2,
      number=3, type=6, cpp_type=4, label=2,
      default_value=0,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      options=None),
    descriptor.FieldDescriptor(
      name='level_min', full_name='proto_oparb.CharTransExecReq.level_min', index=3,
      number=4, type=7, cpp_type=3, label=2,
      default_value=0,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      options=None),
  ],
  extensions=[
  ],
  nested_types=[],  # TODO(robinson): Implement.
  enum_types=[
  ],
  options=None)


_CHARTRANSEXECANS = descriptor.Descriptor(
  name='CharTransExecAns',
  full_name='proto_oparb.CharTransExecAns',
  filename='OpArb.proto',
  containing_type=None,
  fields=[
    descriptor.FieldDescriptor(
      name='new_char_srl', full_name='proto_oparb.CharTransExecAns.new_char_srl', index=0,
      number=1, type=7, cpp_type=3, label=2,
      default_value=0,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      options=None),
    descriptor.FieldDescriptor(
      name='code', full_name='proto_oparb.CharTransExecAns.code', index=1,
      number=2, type=7, cpp_type=3, label=2,
      default_value=0,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      options=None),
  ],
  extensions=[
  ],
  nested_types=[],  # TODO(robinson): Implement.
  enum_types=[
  ],
  options=None)


_SENDREFRESHBILLNOTI = descriptor.Descriptor(
  name='SendRefreshBillNoti',
  full_name='proto_oparb.SendRefreshBillNoti',
  filename='OpArb.proto',
  containing_type=None,
  fields=[
    descriptor.FieldDescriptor(
      name='user_srl', full_name='proto_oparb.SendRefreshBillNoti.user_srl', index=0,
      number=1, type=6, cpp_type=4, label=2,
      default_value=0,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      options=None),
  ],
  extensions=[
  ],
  nested_types=[],  # TODO(robinson): Implement.
  enum_types=[
  ],
  options=None)


_SENDCOMMANDNOTI = descriptor.Descriptor(
  name='SendCommandNoti',
  full_name='proto_oparb.SendCommandNoti',
  filename='OpArb.proto',
  containing_type=None,
  fields=[
    descriptor.FieldDescriptor(
      name='user_srl', full_name='proto_oparb.SendCommandNoti.user_srl', index=0,
      number=1, type=6, cpp_type=4, label=2,
      default_value=0,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      options=None),
    descriptor.FieldDescriptor(
      name='command', full_name='proto_oparb.SendCommandNoti.command', index=1,
      number=2, type=7, cpp_type=3, label=2,
      default_value=0,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      options=None),
    descriptor.FieldDescriptor(
      name='value', full_name='proto_oparb.SendCommandNoti.value', index=2,
      number=3, type=7, cpp_type=3, label=2,
      default_value=0,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      options=None),
    descriptor.FieldDescriptor(
      name='value2', full_name='proto_oparb.SendCommandNoti.value2', index=3,
      number=4, type=7, cpp_type=3, label=1,
      default_value=0,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      options=None),
  ],
  extensions=[
  ],
  nested_types=[],  # TODO(robinson): Implement.
  enum_types=[
  ],
  options=None)


_CHARNAMEBANREQ = descriptor.Descriptor(
  name='CharNameBanReq',
  full_name='proto_oparb.CharNameBanReq',
  filename='OpArb.proto',
  containing_type=None,
  fields=[
    descriptor.FieldDescriptor(
      name='char_srl', full_name='proto_oparb.CharNameBanReq.char_srl', index=0,
      number=1, type=7, cpp_type=3, label=2,
      default_value=0,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      options=None),
    descriptor.FieldDescriptor(
      name='code', full_name='proto_oparb.CharNameBanReq.code', index=1,
      number=2, type=7, cpp_type=3, label=2,
      default_value=0,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      options=None),
  ],
  extensions=[
  ],
  nested_types=[],  # TODO(robinson): Implement.
  enum_types=[
  ],
  options=None)


_CHARNAMEBANANS = descriptor.Descriptor(
  name='CharNameBanAns',
  full_name='proto_oparb.CharNameBanAns',
  filename='OpArb.proto',
  containing_type=None,
  fields=[
    descriptor.FieldDescriptor(
      name='result', full_name='proto_oparb.CharNameBanAns.result', index=0,
      number=1, type=14, cpp_type=8, label=2,
      default_value=0,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      options=None),
  ],
  extensions=[
  ],
  nested_types=[],  # TODO(robinson): Implement.
  enum_types=[
    _CHARNAMEBANANS_RESULT_TYPE,
  ],
  options=None)


_GUILDNAMEBANREQ = descriptor.Descriptor(
  name='GuildNameBanReq',
  full_name='proto_oparb.GuildNameBanReq',
  filename='OpArb.proto',
  containing_type=None,
  fields=[
    descriptor.FieldDescriptor(
      name='guild_srl', full_name='proto_oparb.GuildNameBanReq.guild_srl', index=0,
      number=1, type=7, cpp_type=3, label=2,
      default_value=0,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      options=None),
  ],
  extensions=[
  ],
  nested_types=[],  # TODO(robinson): Implement.
  enum_types=[
  ],
  options=None)


_GUILDNAMEBANANS = descriptor.Descriptor(
  name='GuildNameBanAns',
  full_name='proto_oparb.GuildNameBanAns',
  filename='OpArb.proto',
  containing_type=None,
  fields=[
    descriptor.FieldDescriptor(
      name='result', full_name='proto_oparb.GuildNameBanAns.result', index=0,
      number=1, type=14, cpp_type=8, label=2,
      default_value=0,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      options=None),
  ],
  extensions=[
  ],
  nested_types=[],  # TODO(robinson): Implement.
  enum_types=[
    _GUILDNAMEBANANS_RESULT_TYPE,
  ],
  options=None)


_OPMSG_RESULTSET.fields_by_name['rows'].message_type = _OPMSG_RESULTSET_ROW
_OPMSG.fields_by_name['job_type'].enum_type = _OPMSG_JOBTYPE
_OPMSG.fields_by_name['exec_type'].enum_type = _OPMSG_EXECTYPE
_OPMSG.fields_by_name['arguments'].message_type = _OPMSG_ARGUMENT
_OPMSG.fields_by_name['result_sets'].message_type = _OPMSG_RESULTSET
_KICKUSERANS.fields_by_name['result'].enum_type = _KICKUSERANS_RESULT_TYPE
_SENDMESSAGEANS.fields_by_name['result'].enum_type = _SENDMESSAGEANS_RESULT_TYPE
_DENIEDCHATUSERANS.fields_by_name['result'].enum_type = _DENIEDCHATUSERANS_RESULT_TYPE
_ADDREMAININGMINANS.fields_by_name['result'].enum_type = _ADDREMAININGMINANS_RESULT_TYPE
_BOXNOTIUSERANS.fields_by_name['result'].enum_type = _BOXNOTIUSERANS_RESULT_TYPE
_CHARNAMEBANANS.fields_by_name['result'].enum_type = _CHARNAMEBANANS_RESULT_TYPE
_GUILDNAMEBANANS.fields_by_name['result'].enum_type = _GUILDNAMEBANANS_RESULT_TYPE

class opmsg(message.Message):
  __metaclass__ = reflection.GeneratedProtocolMessageType
  
  class Argument(message.Message):
    __metaclass__ = reflection.GeneratedProtocolMessageType
    DESCRIPTOR = _OPMSG_ARGUMENT
  
  class ResultSet(message.Message):
    __metaclass__ = reflection.GeneratedProtocolMessageType
    
    class Row(message.Message):
      __metaclass__ = reflection.GeneratedProtocolMessageType
      DESCRIPTOR = _OPMSG_RESULTSET_ROW
    DESCRIPTOR = _OPMSG_RESULTSET
  DESCRIPTOR = _OPMSG

class KickUserReq(message.Message):
  __metaclass__ = reflection.GeneratedProtocolMessageType
  DESCRIPTOR = _KICKUSERREQ

class KickUserAns(message.Message):
  __metaclass__ = reflection.GeneratedProtocolMessageType
  DESCRIPTOR = _KICKUSERANS

class SendMessageReq(message.Message):
  __metaclass__ = reflection.GeneratedProtocolMessageType
  DESCRIPTOR = _SENDMESSAGEREQ

class SendMessageAns(message.Message):
  __metaclass__ = reflection.GeneratedProtocolMessageType
  DESCRIPTOR = _SENDMESSAGEANS

class BulkKickReq(message.Message):
  __metaclass__ = reflection.GeneratedProtocolMessageType
  DESCRIPTOR = _BULKKICKREQ

class BulkKickAns(message.Message):
  __metaclass__ = reflection.GeneratedProtocolMessageType
  DESCRIPTOR = _BULKKICKANS

class DeniedChatUserReq(message.Message):
  __metaclass__ = reflection.GeneratedProtocolMessageType
  DESCRIPTOR = _DENIEDCHATUSERREQ

class DeniedChatUserAns(message.Message):
  __metaclass__ = reflection.GeneratedProtocolMessageType
  DESCRIPTOR = _DENIEDCHATUSERANS

class AddRemainingMinReq(message.Message):
  __metaclass__ = reflection.GeneratedProtocolMessageType
  DESCRIPTOR = _ADDREMAININGMINREQ

class AddRemainingMinAns(message.Message):
  __metaclass__ = reflection.GeneratedProtocolMessageType
  DESCRIPTOR = _ADDREMAININGMINANS

class PingReq(message.Message):
  __metaclass__ = reflection.GeneratedProtocolMessageType
  DESCRIPTOR = _PINGREQ

class PingAns(message.Message):
  __metaclass__ = reflection.GeneratedProtocolMessageType
  DESCRIPTOR = _PINGANS

class UpdateServerStatNoti(message.Message):
  __metaclass__ = reflection.GeneratedProtocolMessageType
  DESCRIPTOR = _UPDATESERVERSTATNOTI

class BoxNotiUserReq(message.Message):
  __metaclass__ = reflection.GeneratedProtocolMessageType
  DESCRIPTOR = _BOXNOTIUSERREQ

class BoxNotiUserAns(message.Message):
  __metaclass__ = reflection.GeneratedProtocolMessageType
  DESCRIPTOR = _BOXNOTIUSERANS

class SvrMsgReq(message.Message):
  __metaclass__ = reflection.GeneratedProtocolMessageType
  DESCRIPTOR = _SVRMSGREQ

class SvrMsgAns(message.Message):
  __metaclass__ = reflection.GeneratedProtocolMessageType
  DESCRIPTOR = _SVRMSGANS

class CharTransQueryReq(message.Message):
  __metaclass__ = reflection.GeneratedProtocolMessageType
  DESCRIPTOR = _CHARTRANSQUERYREQ

class CharTransQueryAns(message.Message):
  __metaclass__ = reflection.GeneratedProtocolMessageType
  DESCRIPTOR = _CHARTRANSQUERYANS

class CharTransExecReq(message.Message):
  __metaclass__ = reflection.GeneratedProtocolMessageType
  DESCRIPTOR = _CHARTRANSEXECREQ

class CharTransExecAns(message.Message):
  __metaclass__ = reflection.GeneratedProtocolMessageType
  DESCRIPTOR = _CHARTRANSEXECANS

class SendRefreshBillNoti(message.Message):
  __metaclass__ = reflection.GeneratedProtocolMessageType
  DESCRIPTOR = _SENDREFRESHBILLNOTI

class SendCommandNoti(message.Message):
  __metaclass__ = reflection.GeneratedProtocolMessageType
  DESCRIPTOR = _SENDCOMMANDNOTI

class CharNameBanReq(message.Message):
  __metaclass__ = reflection.GeneratedProtocolMessageType
  DESCRIPTOR = _CHARNAMEBANREQ

class CharNameBanAns(message.Message):
  __metaclass__ = reflection.GeneratedProtocolMessageType
  DESCRIPTOR = _CHARNAMEBANANS

class GuildNameBanReq(message.Message):
  __metaclass__ = reflection.GeneratedProtocolMessageType
  DESCRIPTOR = _GUILDNAMEBANREQ

class GuildNameBanAns(message.Message):
  __metaclass__ = reflection.GeneratedProtocolMessageType
  DESCRIPTOR = _GUILDNAMEBANANS

